// pages/api/admin/newsletter-history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/backend/supabaseClient';
import { withAuth } from '@/backend/middleware/withAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Метод ${req.method} не разрешён` });
  }

  // Получаем список рассылок
  const { data: newsletters, error } = await supabaseAdmin
    .from('scheduled_newsletters')
    .select('*')
    .order('send_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Для каждой рассылки получаем получателей из таблицы scheduled_newsletter_recipients
  const newslettersWithProgress = await Promise.all(
    newsletters.map(async (nl: any) => {
      const { data: recipients, error: recipientsError } = await supabaseAdmin
        .from('scheduled_newsletter_recipients')
        .select('sent')
        .eq('scheduled_newsletter_id', nl.id);

      const counts = { sent: 0, not_sent: 0 };
      if (!recipientsError && recipients) {
        recipients.forEach((recipient: any) => {
          if (recipient.sent) {
            counts.sent += 1;
          } else {
            counts.not_sent += 1;
          }
        });
      }
      const total = counts.sent + counts.not_sent;
      const progress = total ? (counts.sent / total) * 100 : 0;

      return { ...nl, progress, counts };
    })
  );

  return res.status(200).json({ data: newslettersWithProgress });
}

export default withAuth(handler);
