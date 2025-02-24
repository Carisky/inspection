import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";
import { withAuth } from "@/backend/middleware/withAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin.from("email_templates").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const { id, name, design, html } = req.body;

    if (id) {
      const { error } = await supabaseAdmin
        .from("email_templates")
        .update({ name, design, html, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ message: "Шаблон обновлён" });
    } else {
      const { error } = await supabaseAdmin
        .from("email_templates")
        .insert([{ name, design, html, created_at: new Date().toISOString() }]);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ message: "Шаблон создан" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
}

export default withAuth(handler);
