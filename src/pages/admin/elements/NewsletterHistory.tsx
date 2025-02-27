// components/NewsletterHistory.tsx
import React, { useEffect, useState } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

type Order = "asc" | "desc";

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
  // Для удобства управления состоянием паузы (если не приходит с бэкенда, по умолчанию false)
  paused?: boolean;
}

const NewsletterHistory: React.FC = () => {
  const [newsletters, setNewsletters] = useState<ScheduledNewsletter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof ScheduledNewsletter>("send_at");
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Функция загрузки данных истории рассылок
  const fetchData = async (initial = false) => {
    if (initial) {
      setLoading(true);
    }
    try {
      const res = await fetch("/api/admin/newsletter-history");
      const data = await res.json();
      // Если объект рассылки не содержит поле paused – добавляем его по умолчанию
      const newslettersWithPause = data.data.map((nl: ScheduledNewsletter) => ({
        ...nl,
        paused: nl.paused ?? false,
      }));
      setNewsletters(newslettersWithPause);
    } catch (err) {
      console.error("Ошибка загрузки истории рассылок:", err);
    } finally {
      if (initial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Первая загрузка данных
    fetchData(true);
    // Обновляем данные каждые 60 секунд
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Функция сортировки
  const handleSort = (property: keyof ScheduledNewsletter) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Сортируем рассылки согласно выбранным параметрам
  const sortedNewsletters = [...newsletters].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Функция для загрузки и просмотра шаблона письма
  const handleViewTemplate = async (templateId: number) => {
    try {
      // Предполагается, что API-роут для получения шаблона работает через GET и принимает параметр id
      const res = await fetch(`/api/admin/email-template?id=${templateId}`);
      const data = await res.json();
      setTemplateHtml(data.html);
      setOpenModal(true);
    } catch (err) {
      console.error("Ошибка загрузки шаблона", err);
    }
  };

  // Функция для переключения состояния паузы рассылки
  const togglePause = async (
    newsletterId: number,
    currentPause: boolean | undefined
  ) => {
    const newPauseState = !currentPause;
    try {
      const res = await fetch("/api/admin/newsletter-pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsletterId,
          paused: newPauseState,
        }),
      });
      const result = await res.json();
      console.log(result.message);
      // Обновляем состояние для конкретной рассылки
      setNewsletters((prev) =>
        prev.map((nl) =>
          nl.id === newsletterId ? { ...nl, paused: newPauseState } : nl
        )
      );
    } catch (err) {
      console.error("Ошибка обновления паузы", err);
    }
  };

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
            <TableCell sortDirection={orderBy === "send_at" ? order : false}>
              <TableSortLabel
                active={orderBy === "send_at"}
                direction={orderBy === "send_at" ? order : "asc"}
                onClick={() => handleSort("send_at")}
              >
                Время отправки
              </TableSortLabel>
            </TableCell>
            <TableCell>Статус</TableCell>
            <TableCell sortDirection={orderBy === "progress" ? order : false}>
              <TableSortLabel
                active={orderBy === "progress"}
                direction={orderBy === "progress" ? order : "asc"}
                onClick={() => handleSort("progress")}
              >
                Прогресс
              </TableSortLabel>
            </TableCell>
            <TableCell>Шаблон</TableCell>
            <TableCell>Пауза</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedNewsletters.map((nl) => (
            <TableRow key={nl.id}>
              <TableCell>{nl.id}</TableCell>
              <TableCell>{nl.subject}</TableCell>
              <TableCell>{new Date(nl.send_at).toLocaleString()}</TableCell>
              <TableCell>
                {nl.counts.sent} из {nl.counts.sent + nl.counts.not_sent}{" "}
                отправлено
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
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleViewTemplate(nl.email_template_id)}
                >
                  Просмотр
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={nl.paused ? "secondary" : "primary"}
                  onClick={() => togglePause(nl.id, nl.paused)}
                >
                  {nl.paused ? "Возобновить" : "Пауза"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Модальное окно для просмотра шаблона */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Шаблон письма</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: templateHtml || "" }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NewsletterHistory;
