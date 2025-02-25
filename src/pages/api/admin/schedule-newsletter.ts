// pages/api/admin/schedule-newsletter.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import { withAuth } from "@/backend/middleware/withAuth";

interface ScheduledNewsletter {
  id: number;
  email_template_id: number;
  subject: string;
  list_id: number;
  send_at: string;
  sent: boolean;
  created_at: string;
  updated_at?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  if (req.method?.toUpperCase() !== "POST") {
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  const { email_template_id, subject, list_id, send_at, id } = req.body;

  if (!email_template_id || !subject || !list_id || !send_at) {
    return res.status(400).json({ error: "Пожалуйста, заполните все поля" });
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from("scheduled_newsletters")
      .update({
        email_template_id,
        subject,
        list_id,
        send_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Рассылка обновлена" });
  } else {
    const { data, error } = await supabaseAdmin
      .from("scheduled_newsletters")
      .insert([{
        email_template_id,
        subject,
        list_id,
        send_at,
        sent: false,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error || !data || (data as ScheduledNewsletter[]).length === 0) {
      return res
        .status(500)
        .json({ error: error?.message || "Не удалось создать рассылку" });
    }

    const newsletter = (data as ScheduledNewsletter[])[0];
    const newsletterId = newsletter.id;

    const { data: clientsData, error: clientsError } = await supabaseAdmin
      .from("clients_lists")
      .select("client:clients(email)")
      .eq("list_id", list_id);

    if (clientsError) {
      return res.status(500).json({ error: clientsError.message });
    }

    const recipients = clientsData.map((row: any) => row.client.email);

    if (recipients.length === 0) {
      return res.status(400).json({ error: "В выбранном списке нет клиентов" });
    }

    const insertData = recipients.map((email: string) => ({
      scheduled_newsletter_id: newsletterId,
      recipient_email: email,
      sent: false,
      created_at: new Date().toISOString(),
    }));

    const chunkSize = 100;
    for (let i = 0; i < insertData.length; i += chunkSize) {
      const chunk = insertData.slice(i, i + chunkSize);

      const { error: insertError } = await supabaseAdmin
        .from("scheduled_newsletter_recipients")
        .insert(chunk);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
    }

    return res
      .status(201)
      .json({ message: "Рассылка запланирована", data: newsletter });
  }
}

export default withAuth(handler);
