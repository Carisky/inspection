import React, { useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailTemplateEditor: React.FC = () => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [name, setName] = useState("");

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.exportHtml((data: { design: any; html: string }) => {
      const { design, html } = data;
      console.log("exportHtml", html);

      // Отправляем данные шаблона (название, design и html) на сервер
      fetch("/api/admin/email-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ design, html, name }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log("Template saved:", result);
          toast.success("Шаблон сохранён успешно!");
        })
        .catch((error) => {
          console.error("Error saving template:", error);
          toast.error("Ошибка при сохранении шаблона");
        });
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    console.log("Editor is ready");
    // Здесь можно загрузить начальный шаблон, если нужно:
    // unlayer.loadDesign({ ... });
  };

  return (
    <>
      <EmailEditor
        style={{ height: "78vh" }}
        ref={emailEditorRef}
        onReady={onReady}
      />
      <Box sx={{ marginBottom: "10px" }} />

      <Box>
        <TextField
          label="Название шаблона"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ height: "40px", marginRight: "10px" }}
        />
        <Button
          sx={{ height: "56px" }}
          variant="outlined"
          onClick={exportHtml}
        >
          Export HTML
        </Button>
      </Box>
      {/* Контейнер для тостов */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EmailTemplateEditor;
