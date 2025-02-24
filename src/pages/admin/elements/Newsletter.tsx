import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
} from '@mui/material';

interface EmailTemplate {
  id: number;
  name: string;
  design: any;
  html: string;
}

interface MailingList {
  id: number;
  name: string;
  description?: string;
}

const Newsletter: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Состояния для рассылочного списка
  const [mailingLists, setMailingLists] = useState<MailingList[]>([]);
  const [loadingLists, setLoadingLists] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<MailingList | null>(null);

  // Загружаем шаблоны
  useEffect(() => {
    setLoadingTemplates(true);
    fetch('/api/admin/email-templates')
      .then((res) => res.json())
      .then((data) => setTemplates(data.data))
      .catch((err) => console.error('Ошибка загрузки шаблонов:', err))
      .finally(() => setLoadingTemplates(false));
  }, []);

  // Загружаем рассылочные списки
  useEffect(() => {
    setLoadingLists(true);
    fetch('/api/admin/lists')
      .then((res) => res.json())
      .then((data) => setMailingLists(data.data))
      .catch((err) => console.error('Ошибка загрузки списков:', err))
      .finally(() => setLoadingLists(false));
  }, []);

  // Обновляем превью шаблона, когда выбранный шаблон меняется
  useEffect(() => {
    if (selectedTemplate) {
      setPreviewHtml(selectedTemplate.html);
    } else {
      setPreviewHtml('');
    }
  }, [selectedTemplate]);

  const handleSendNewsletter = () => {
    if (!selectedTemplate || !subject || !selectedList) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }
    setSending(true);
    fetch('/api/admin/send-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: selectedTemplate.id,
        subject,
        listId: selectedList.id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('Рассылка отправлена:', result);
        alert('Рассылка успешно отправлена');
      })
      .catch((err) => {
        console.error('Ошибка отправки рассылки:', err);
        alert('Ошибка отправки рассылки');
      })
      .finally(() => setSending(false));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Newsletter
      </Typography>
      <Typography variant="body1" gutterBottom>
        Здесь вы можете управлять рассылкой новостей.
      </Typography>

      {/* Выбор шаблона */}
      <Box sx={{ mt: 2 }}>
        {loadingTemplates ? (
          <CircularProgress size={24} />
        ) : (
          <Autocomplete
            options={templates}
            getOptionLabel={(option) => option.name}
            value={selectedTemplate}
            onChange={(event, newValue) => setSelectedTemplate(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Выберите шаблон" variant="outlined" fullWidth />
            )}
          />
        )}
      </Box>

      {/* Выбор рассылочного списка */}
      <Box sx={{ mt: 2 }}>
        {loadingLists ? (
          <CircularProgress size={24} />
        ) : (
          <Autocomplete
            options={mailingLists}
            getOptionLabel={(option) => option.name}
            value={selectedList}
            onChange={(event, newValue) => setSelectedList(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Выберите список рассылки" variant="outlined" fullWidth />
            )}
          />
        )}
      </Box>

      {/* Превью выбранного шаблона */}
      {previewHtml && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6">Превью шаблона:</Typography>
          <Box sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </Box>
      )}

      {/* Форма рассылки */}
      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="Тема рассылки"
          variant="outlined"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSendNewsletter}
          disabled={sending}
        >
          {sending ? 'Отправка...' : 'Отправить рассылку'}
        </Button>
      </Box>
    </Box>
  );
};

export default Newsletter;
