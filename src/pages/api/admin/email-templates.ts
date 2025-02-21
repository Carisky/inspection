import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/backend/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toUpperCase() === "GET") {
    const { data, error } = await supabaseAdmin
      .from("email_templates")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }
}
