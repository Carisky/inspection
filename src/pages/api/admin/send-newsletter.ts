import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import nodemailer from "nodemailer";
import { withAuth } from "@/backend/middleware/withAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  const { templateId, subject, listId } = req.body;
  if (!templateId || !subject || !listId) {
    return res.status(400).json({ error: "Пожалуйста, заполните все поля" });
  }

  // Получаем шаблон письма
  const { data: template, error: fetchError } = await supabaseAdmin
    .from("email_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message });
  }
  if (!template) {
    return res.status(404).json({ error: "Шаблон не найден" });
  }
  const baseHtml: string = template.html;

  // Получаем всех клиентов, привязанных к выбранному списку
  const { data: clientsData, error: clientsError } = await supabaseAdmin
    .from("clients_lists")
    .select("client:clients(email)")
    .eq("list_id", listId);

  if (clientsError) {
    return res.status(500).json({ error: clientsError.message });
  }

  // Извлекаем email-адреса
  const emails: string[] = clientsData.map((row: any) => row.client.email);
  if (emails.length === 0) {
    return res.status(400).json({ error: "В выбранном списке нет клиентов" });
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

  try {
    // Отправляем индивидуальные письма с персонализацией unsubscribe-ссылки
    const sendPromises = emails.map((recipient) => {
      const personalizedHtml = baseHtml.replace(/\[\[recipient_email\]\]/g, recipient);
      return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipient,
        subject,
        html: personalizedHtml,
      });
    });

    const results = await Promise.all(sendPromises);
    return res.status(200).json({ message: "Рассылка отправлена", results });
  } catch (err: any) {
    return res.status(500).json({ error: "Ошибка отправки: " + err.message });
  }
}

export default withAuth(handler);
