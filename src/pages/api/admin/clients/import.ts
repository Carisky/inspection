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

  const results = [];
  for (const email of emails) {
    // Проверка существования клиента
    const { data: existing } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle();
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
        results.push({ email, error: clientError.message });
        continue;
      }
      clientId = clientData?.id;
    }

    // Создаем запись подписки
    const { data: subData, error: subError } = await supabaseAdmin
      .from('clients_lists')
      .insert([{ client_id: clientId, list_id: listId }]);
    if (subError) {
      results.push({ email, error: subError.message });
    } else {
      results.push({ email, subscription: subData });
    }
  }

  return res.status(201).json({ data: results });
}

export default withAuth(handler);
