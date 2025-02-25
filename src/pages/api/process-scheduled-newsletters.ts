import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import nodemailer from "nodemailer";


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  // Выбираем рассылки, у которых время отправки наступило и которые ещё не отправлены
  const { data: newsletters, error: nlError } = await supabaseAdmin
    .from("scheduled_newsletters")
    .select("*")
    .lte("send_at", new Date().toISOString())
    .eq("sent", false);

  if (nlError) {
    return res.status(500).json({ error: nlError.message });
  }
  if (!newsletters || newsletters.length === 0) {
    return res.status(200).json({ message: "Нет рассылок для обработки" });
  }

  // Создаем транспортёр для отправки писем
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  for (const newsletter of newsletters) {
    const { id: newsletterId, email_template_id, subject } = newsletter;
    console.log(`Обработка рассылки id ${newsletterId}`);

    // Получаем шаблон письма
    const { data: template, error: templateError } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("id", email_template_id)
      .single();

    if (templateError || !template) {
      console.error(
        `Ошибка получения шаблона для рассылки id ${newsletterId}:`,
        templateError?.message
      );
      continue;
    }
    const baseHtml: string = template.html;

    // Выбираем до 10 ещё не отправленных получателей для этой рассылки
    const { data: recipients, error: recError } = await supabaseAdmin
      .from("scheduled_newsletter_recipients")
      .select("*")
      .eq("scheduled_newsletter_id", newsletterId)
      .eq("sent", false)
      .limit(10);

    if (recError) {
      console.error(
        `Ошибка получения получателей для рассылки id ${newsletterId}:`,
        recError.message
      );
      continue;
    }
    if (!recipients || recipients.length === 0) {
      console.log(`Все получатели для рассылки id ${newsletterId} уже обработаны.`);
      // Если для рассылки нет получателей, помечаем её как отправленную
      await supabaseAdmin
        .from("scheduled_newsletters")
        .update({ sent: true, updated_at: new Date().toISOString() })
        .eq("id", newsletterId);
      continue;
    }

    console.log(`Рассылка id ${newsletterId}: найдено ${recipients.length} получателей для отправки.`);

    // Обрабатываем каждого получателя по одному с задержкой 1 секунда
    for (const recipient of recipients) {
      const recipientEmail = recipient.recipient_email;
      try {
        const personalizedHtml = baseHtml.replace(/\[\[recipient_email\]\]/g, recipientEmail);
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: recipientEmail,
          subject,
          html: personalizedHtml,
        });
        console.log(`Письмо отправлено ${recipientEmail} для рассылки id ${newsletterId}`);

        // Помечаем получателя как обработанного
        await supabaseAdmin
          .from("scheduled_newsletter_recipients")
          .update({ sent: true, sent_at: new Date().toISOString() })
          .eq("id", recipient.id);
      } catch (err: any) {
        console.error(
          `Ошибка отправки письма ${recipientEmail} для рассылки id ${newsletterId}:`,
          err.message
        );
      }
    }

    // Если для данной рассылки больше нет незавершённых получателей, помечаем её как отправленную
    const { data: remaining, error: remainingError } = await supabaseAdmin
      .from("scheduled_newsletter_recipients")
      .select("id")
      .eq("scheduled_newsletter_id", newsletterId)
      .eq("sent", false);
    if (remainingError) {
      console.error(
        `Ошибка проверки оставшихся получателей для рассылки id ${newsletterId}:`,
        remainingError.message
      );
    } else if (!remaining || remaining.length === 0) {
      await supabaseAdmin
        .from("scheduled_newsletters")
        .update({ sent: true, updated_at: new Date().toISOString() })
        .eq("id", newsletterId);
      console.log(`Рассылка id ${newsletterId} полностью обработана.`);
    }
  }

  return res.status(200).json({ message: "Обработка запланированных рассылок выполнена" });
}

export default handler;
