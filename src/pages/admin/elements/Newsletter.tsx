import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

interface EmailTemplate {
  id: number;
  name: string;
  design: any;
  html: string;
}

const Newsletter: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  
  useEffect(() => {
    setLoadingTemplates(true);
    fetch('/api/admin/email-templates')
      .then((res) => res.json())
      .then((data) => {
        
        setTemplates(data.data);
      })
      .catch((err) => {
        console.error('Ошибка загрузки шаблонов:', err);
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  
  useEffect(() => {
    if (selectedTemplateId !== '') {
      const template = templates.find((t) => t.id === selectedTemplateId);
      setPreviewHtml(template ? template.html : '');
    } else {
      setPreviewHtml('');
    }
  }, [selectedTemplateId, templates]);

  const handleSendNewsletter = () => {
    if (!selectedTemplateId || !subject || !recipient) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    fetch('/api/admin/send-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: selectedTemplateId,
        subject,
        recipient,
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

      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="template-select-label">Выберите шаблон</InputLabel>
        <Select
          labelId="template-select-label"
          value={selectedTemplateId}
          label="Выберите шаблон"
          onChange={(e) => setSelectedTemplateId(e.target.value as number)}
        >
          {loadingTemplates ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

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
          <Box
            sx={{ mt: 1 }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </Box>
      )}

      <Box component="form" sx={{ mt: 2 }}>
        <TextField
          label="Тема рассылки"
          variant="outlined"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Email получателя"
          variant="outlined"
          fullWidth
          margin="normal"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
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
