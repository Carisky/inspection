import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';
import { withAuth } from '@/backend/middleware/withAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  const { emails, listId } = req.body;
  if (!emails || !Array.isArray(emails) || !listId) {
    return res.status(400).json({ error: 'emails должен быть массивом и listId обязателен' });
  }

  try {
    // Обработка всех email параллельно
    const results = await Promise.all(emails.map(async (email) => {
      // Проверяем, существует ли клиент
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        return { email, error: checkError.message };
      }

      let clientId;
      if (existing) {
        clientId = existing.id;
      } else {
        const { data: clientData, error: clientError } = await supabaseAdmin
          .from('clients')
          .insert([{ email }])
          .select('id')
          .maybeSingle();
        if (clientError) {
          return { email, error: clientError.message };
        }
        clientId = clientData?.id;
      }

      // Создаем запись подписки
      const { data: subData, error: subError } = await supabaseAdmin
        .from('clients_lists')
        .insert([{ client_id: clientId, list_id: listId }]);
      if (subError) {
        return { email, error: subError.message };
      }
      return { email, subscription: subData };
    }));

    return res.status(201).json({ data: results });
  } catch (err: any) {
    return res.status(500).json({ error: 'Ошибка импорта CSV: ' + err.message });
  }
}

export default withAuth(handler);
