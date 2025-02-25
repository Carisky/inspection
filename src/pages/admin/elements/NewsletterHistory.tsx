// elements/NewsletterHistory.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  TableSortLabel,
} from '@mui/material';

type Order = 'asc' | 'desc';

interface NewsletterCounts {
  sent: number;
  not_sent: number;
}

interface ScheduledNewsletter {
  id: number;
  email_template_id: number;
  list_id: number;
  subject: string;
  send_at: string;
  sent: boolean;
  created_at: string;
  updated_at: string;
  progress: number; // процент отправленных сообщений
  counts: NewsletterCounts;
}

const NewsletterHistory: React.FC = () => {
  const [newsletters, setNewsletters] = useState<ScheduledNewsletter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof ScheduledNewsletter>('send_at');

  // Функция для загрузки данных
  const fetchData = async (initial = false) => {
    if (initial) {
      setLoading(true);
    }
    try {
      const res = await fetch('/api/admin/newsletter-history');
      const data = await res.json();
      setNewsletters(data.data);
    } catch (err) {
      console.error('Ошибка загрузки истории рассылок:', err);
    } finally {
      if (initial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Первая загрузка данных
    fetchData(true);
    // Обновление данных каждые 60 секунд без показа загрузчика
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (property: keyof ScheduledNewsletter) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedNewsletters = [...newsletters].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        История рассылок
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Тема</TableCell>
            <TableCell sortDirection={orderBy === 'send_at' ? order : false}>
              <TableSortLabel
                active={orderBy === 'send_at'}
                direction={orderBy === 'send_at' ? order : 'asc'}
                onClick={() => handleSort('send_at')}
              >
                Время отправки
              </TableSortLabel>
            </TableCell>
            <TableCell>Статус</TableCell>
            <TableCell sortDirection={orderBy === 'progress' ? order : false}>
              <TableSortLabel
                active={orderBy === 'progress'}
                direction={orderBy === 'progress' ? order : 'asc'}
                onClick={() => handleSort('progress')}
              >
                Прогресс
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedNewsletters.map((nl) => (
            <TableRow key={nl.id}>
              <TableCell>{nl.id}</TableCell>
              <TableCell>{nl.subject}</TableCell>
              <TableCell>{new Date(nl.send_at).toLocaleString()}</TableCell>
              <TableCell>
                {nl.counts.sent} из {nl.counts.sent + nl.counts.not_sent} отправлено
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={nl.progress} />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">
                      {`${Math.round(nl.progress)}%`}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default NewsletterHistory;
