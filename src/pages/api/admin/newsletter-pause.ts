// pages/api/admin/newsletter-pause.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import { withAuth } from "@/backend/middleware/withAuth";

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method?.toUpperCase() === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }
  
  if (req.method?.toUpperCase() !== "POST") {
    res.status(405).json({ error: `Метод ${req.method} не разрешён` });
    return;
  }

  const { newsletterId, paused } = req.body;
  if (typeof newsletterId !== "number" || typeof paused !== "boolean") {
    res.status(400).json({ error: "Неверные данные запроса" });
    return;
  }

  // Обновляем глобальное состояние паузы в таблице scheduled_newsletters
  const { error: updateError } = await supabaseAdmin
    .from("scheduled_newsletters")
    .update({ paused, updated_at: new Date().toISOString() })
    .eq("id", newsletterId);

  if (updateError) {
    res.status(500).json({ error: updateError.message });
    return;
  }

  // (Опционально) Обновляем состояние паузы для всех получателей данной рассылки
  const { error: recError } = await supabaseAdmin
    .from("scheduled_newsletter_recipients")
    .update({ paused })
    .eq("scheduled_newsletter_id", newsletterId);

  if (recError) {
    res.status(500).json({ error: recError.message });
    return;
  }

  res.status(200).json({ message: `Статус паузы обновлён на ${paused}` });
}

export default withAuth(handler);
