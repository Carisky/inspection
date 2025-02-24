import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';
import { withAuth } from '@/backend/middleware/withAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { listId } = req.query;
    if (listId) {
      const { data, error } = await supabaseAdmin
        .from('clients_lists')
        .select('id, client:clients(id, email, created_at)')
        .eq('list_id', listId)
        .order('id', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      const clients = data.map((row: any) => ({
        subscriptionId: row.id,
        ...row.client,
      }));
      return res.status(200).json({ data: clients });
    } else {
      const { data, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .order('id', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }
  }

  if (req.method === 'POST') {
    const { email, listId } = req.body;
    if (!email || !listId)
      return res.status(400).json({ error: 'Email and listId are required' });

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
      if (clientError)
        return res.status(500).json({ error: clientError.message });
      clientId = clientData?.id;
    }

    const { data: subData, error: subError } = await supabaseAdmin
      .from('clients_lists')
      .insert([{ client_id: clientId, list_id: listId }]);
    if (subError) return res.status(500).json({ error: subError.message });
    
    return res.status(201).json({ data: subData });
  }

  if (req.method === 'PUT') {
    const { id, email } = req.body;
    if (!id || !email)
      return res.status(400).json({ error: 'ID and email are required' });
    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({ email })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const { subscriptionId } = req.query;
    if (!subscriptionId)
      return res.status(400).json({ error: 'subscriptionId is required' });
    const { data, error } = await supabaseAdmin
      .from('clients_lists')
      .delete()
      .eq('id', subscriptionId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
}

export default withAuth(handler);
