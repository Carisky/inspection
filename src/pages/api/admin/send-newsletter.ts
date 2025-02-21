import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toUpperCase() !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  const { templateId, subject, recipient } = req.body;

  if (!templateId || !subject || !recipient) {
    return res.status(400).json({ error: "Пожалуйста, заполните все поля" });
  }

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

  const html = template.html;

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
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipient,
      subject,
      html,
    });

    return res.status(200).json({ message: "Рассылка отправлена", info });
  } catch (err: any) {
    return res.status(500).json({ error: "Ошибка отправки: " + err.message });
  }
}
