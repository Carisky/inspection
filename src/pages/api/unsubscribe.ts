import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Разрешаем только GET-запросы
  if (req.method?.toUpperCase() !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email обязателен' });
  }

  // Находим клиента по email
  const { data: client, error: clientError } = await supabaseAdmin
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();

  if (clientError || !client) {
    return res.status(404).json({ error: 'Клиент не найден' });
  }

  // Удаляем все записи подписки для данного клиента
  const { error } = await supabaseAdmin
    .from('clients_lists')
    .delete()
    .eq('client_id', client.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Отдаем простой текстовый ответ (можно вернуть любой контент)
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send('Вы успешно отписались от рассылки.');
}
