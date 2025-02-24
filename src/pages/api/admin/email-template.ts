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

  const { design, html, name } = req.body;

  const { data, error } = await supabaseAdmin
    .from("email_templates")
    .insert([{ design, html, name }]);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: "Шаблон сохранён", data });
  return;
}

export default withAuth(handler);
