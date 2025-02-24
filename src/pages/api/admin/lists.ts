import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';
import { withAuth } from '@/backend/middleware/withAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('lists')
      .select('*')
      .order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const { data, error } = await supabaseAdmin
      .from('lists')
      .insert([{ name, description }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ data });
  }

  if (req.method === 'PUT') {
    const { id, name, description } = req.body;
    if (!id || !name)
      return res.status(400).json({ error: 'ID and name are required' });
    const { data, error } = await supabaseAdmin
      .from('lists')
      .update({ name, description })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID is required' });
    const { data, error } = await supabaseAdmin
      .from('lists')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
}

export default withAuth(handler);
