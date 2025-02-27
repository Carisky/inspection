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
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [name, setName] = useState("");

  // Функция для загрузки списка шаблонов
  const fetchTemplates = () => {
    fetch("/api/admin/email-templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Ошибка загрузки шаблонов");
        } else {
          setTemplates(data.data);
          // Если копирование прошло успешно, можно найти новый шаблон по имени
          const newTemplate = data.data.find(
            (t: EmailTemplate) => t.name === name
          );
          if (newTemplate) {
            setSelectedTemplateId(newTemplate.id);
            emailEditorRef.current?.editor?.loadDesign(newTemplate.design);
          }
        }
      })
      .catch(() => toast.error("Ошибка при получении данных"));
  };

  // Загружаем список шаблонов при загрузке страницы
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Загрузка выбранного шаблона в редактор
  const loadTemplate = (id: number) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setName(template.name);
      setSelectedTemplateId(template.id);
      emailEditorRef.current?.editor?.loadDesign(template.design);
    }
  };

  // Сохранение изменений шаблона (существующего шаблона)
  // Функция экспорта шаблона с проверкой наличия header/footer
  const exportHtml = () => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;
    editor.exportHtml((data: { design: any; html: string }) => {
      const { design, html } = data;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

      // Определяем HTML для header и footer
      const headerHtml = `
      <header>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td align="center" width="20%" valign="center" dir="ltr">
              <a href="https://www.tsl-silesia.com.pl" target="_blank" rel="noopener nofollow" style="display: inline-block; font-size: 0; text-decoration: none; line-height: normal!important;">
                <img src="https://www.tsl-silesia.com.pl/wp-content/uploads/2020/04/logo-z-napisem-z-R.jpg" width="120" height="119" alt="TSL Silesia" border="0" style="display: inline-block; max-width: 100%!important; height: auto; padding: 0; border: 0; font-size: 12px;">
              </a>
            </td>
            <td width="80%" align="center" valign="center" dir="ltr">
              <a href="https://www.tsl-silesia.com.pl" target="_blank" style="text-decoration: none; line-height: normal;">
                <span style="font-size: 29px;font-family: Verdana, Geneva, sans-serif;font-weight: normal;color: #222222; text-decoration: none; line-height: normal; margin: 0;">TSL Silesia</span>
                <br>
                <span style="font-size: 14px;font-family: Verdana, Geneva, sans-serif;font-weight: normal;color: #222222; text-decoration: none; line-height: 150%;">Najwyższa jakość obsługi spedycyjno-celnej</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      </header>
    `;
      const footerHtml = `
      <footer style="text-align:center;margin-top:20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
        <tbody>
          <tr>
            <td width="100%" align="center" dir="ltr" style="padding-top: 24px">
              <a href="${siteUrl}/api/unsubscribe?email=[[recipient_email]]" style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;" target="_blank">
                Unsubscribe
              </a>
              <span style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;">
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              </span>
              <a style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;" href="{profile_url}" target="_blank">
                Manage your subscription
              </a>
              <span style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;">
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              </span>
              <a style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;" href="{email_url}" target="_blank">
                Zobacz online
              </a>
            </td>
          </tr>
          <tr>
            <td width="100%" align="center" dir="ltr" style="padding-top: 24px">
              <div style="font-size: 13px; font-family: Verdana, Geneva, sans-serif; font-weight: normal; color: #222222; text-decoration: none; line-height: normal;">
                TSL Silesia<br><br>
                <em></em>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </footer>
    `;

      // Если в исходном HTML нет тега <header>, добавляем его в начало
      let modifiedHtml = html;
      if (!/<header[\s>]/i.test(html)) {
        modifiedHtml = headerHtml + modifiedHtml;
      }
      // Если в исходном HTML нет тега <footer>, добавляем его в конец
      if (!/<footer[\s>]/i.test(html)) {
        modifiedHtml = modifiedHtml + footerHtml;
      }

      fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTemplateId,
          design,
          html: modifiedHtml,
          name,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Шаблон сохранён успешно!");
          fetchTemplates();
        })
        .catch(() => toast.error("Ошибка при сохранении шаблона"));
    });
  };

  // Новый обработчик для копирования шаблона
  const copyTemplate = () => {
    if (!selectedTemplateId) {
      toast.error("Сначала выберите шаблон для копирования");
      return;
    }
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;
    editor.exportHtml((data: { design: any; html: string }) => {
      const { design, html } = data;
      // Для копирования id не передаём, чтобы API создало новый шаблон
      fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, design, html }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.error) {
            toast.error("Ошибка при копировании шаблона");
          } else {
            toast.success("Шаблон скопирован успешно!");
            // Обновляем список шаблонов и устанавливаем выбор на новый шаблон
            fetchTemplates();
          }
        })
        .catch(() => toast.error("Ошибка при копировании шаблона"));
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
              <TextField
                {...params}
                label="Выберите шаблон"
                variant="outlined"
              />
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
        <Button
          variant="contained"
          onClick={exportHtml}
          sx={{ marginRight: "10px" }}
        >
          Сохранить
        </Button>
        <Button variant="contained" onClick={copyTemplate}>
          Копировать шаблон
        </Button>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EmailTemplateEditor;
