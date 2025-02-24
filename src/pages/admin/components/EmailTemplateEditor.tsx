import React, { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import EmailEditor, { EditorRef } from "react-email-editor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EmailTemplate {
  id: number;
  name: string;
  design: any;
  html: string;
}

const EmailTemplateEditor: React.FC = () => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [name, setName] = useState("");

  // Загружаем список шаблонов при загрузке страницы
  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Ошибка загрузки шаблонов");
        } else {
          setTemplates(data.data);
        }
      })
      .catch(() => toast.error("Ошибка при получении данных"));
  }, []);

  // Загрузка выбранного шаблона
  const loadTemplate = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setName(template.name);
      setSelectedTemplateId(template.id);
      emailEditorRef.current?.editor?.loadDesign(template.design);
    }
  };

  // Экспорт и сохранение шаблона с добавлением кнопки "Отписаться"
  const exportHtml = () => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;
    editor.exportHtml((data: { design: any; html: string }) => {
      const { design, html } = data;

      // Получаем домен из переменной окружения
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      // Формируем HTML кнопки "Отписаться"
      const unsubscribeButton = `
        <div style="text-align:center;margin-top:20px;">
          <a href="${siteUrl}/api/unsubscribe?email=[[recipient_email]]" style="display:inline-block;padding:10px 20px;background:#8d004c;color:#fff;text-decoration:none;border-radius:4px;">
            Unsubscribe
          </a>
        </div>`;
      // Добавляем кнопку в конец HTML
      const modifiedHtml = html + unsubscribeButton;

      fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTemplateId, design, html: modifiedHtml, name }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Шаблон сохранён успешно!");
        })
        .catch(() => toast.error("Ошибка при сохранении шаблона"));
    });
  };

  return (
    <>
      <Box sx={{ marginBottom: "10px" }}>
        {templates.length === 0 ? (
          <CircularProgress size={24} />
        ) : (
          <Autocomplete
            options={templates}
            getOptionLabel={(option) => option.name}
            value={templates.find((t) => t.id === selectedTemplateId) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                loadTemplate(newValue.id);
              } else {
                setSelectedTemplateId(null);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Выберите шаблон" variant="outlined" />
            )}
            sx={{ width: 300, marginRight: "10px" }}
          />
        )}
      </Box>

      <EmailEditor style={{ height: "78vh" }} ref={emailEditorRef} />

      <Box sx={{ marginTop: "10px" }}>
        <TextField
          label="Название шаблона"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginRight: "10px" }}
        />
        <Button variant="outlined" onClick={exportHtml}>
          Сохранить
        </Button>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EmailTemplateEditor;
