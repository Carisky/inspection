import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Обработка CORS preflight запроса
  if (req.method?.toUpperCase() === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { design, html, name } = req.body;

  // Сохраняем данные шаблона в таблицу email_templates
  const { data, error } = await supabaseAdmin
    .from('email_templates')
    .insert([{ design, html, name }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Шаблон сохранён', data });
}
