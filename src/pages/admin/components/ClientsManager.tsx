import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  SnackbarCloseReason,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Papa from "papaparse";

interface Client {
  subscriptionId: number; // id из таблицы clients_lists
  id: number; // id клиента (таблица clients)
  email: string;
  created_at: string;
}

interface ClientsManagerProps {
  listId: number;
}

const ClientsManager: React.FC<ClientsManagerProps> = ({ listId }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<
    number | null
  >(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Состояния для поиска
  const [clientSearch, setClientSearch] = useState("");

  // Состояния для уведомлений (тосты)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?listId=${listId}`);
      if (!res.ok) throw new Error("Ошибка загрузки клиентов");
      const data = await res.json();
      setClients(data.data);
    } catch (error: any) {
      console.error("Ошибка загрузки клиентов:", error);
      showSnackbar(error.message || "Ошибка загрузки клиентов", "error");
    } finally {
      setLoading(false);
    }
  };

  // Добавление нового клиента в выбранный список
  const handleAddClient = async () => {
    if (!newEmail) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, listId }),
      });
      if (!res.ok) throw new Error("Ошибка добавления клиента");
      showSnackbar("Клиент успешно добавлен", "success");
      setNewEmail("");
      fetchClients();
    } catch (error: any) {
      console.error("Ошибка добавления клиента:", error);
      showSnackbar(error.message || "Ошибка добавления клиента", "error");
    }
  };

  // Удаление записи о подписке (из таблицы clients_lists)
  const handleDeleteClient = async (subscriptionId: number) => {
    try {
      const res = await fetch(
        `/api/admin/clients?subscriptionId=${subscriptionId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления клиента");
      showSnackbar("Клиент удалён", "success");
      fetchClients();
    } catch (error: any) {
      console.error("Ошибка удаления клиента:", error);
      showSnackbar(error.message || "Ошибка удаления клиента", "error");
    }
  };

  // Редактирование email
  const handleEditClient = (client: Client) => {
    setEditingSubscriptionId(client.subscriptionId);
    setEditingEmail(client.email);
  };

  const handleUpdateClient = async () => {
    if (editingSubscriptionId === null) return;
    const client = clients.find(
      (c) => c.subscriptionId === editingSubscriptionId
    );
    if (!client) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client.id, email: editingEmail }),
      });
      if (!res.ok) throw new Error("Ошибка обновления клиента");
      showSnackbar("Данные клиента обновлены", "success");
      setEditingSubscriptionId(null);
      setEditingEmail("");
      fetchClients();
    } catch (error: any) {
      console.error("Ошибка обновления клиента:", error);
      showSnackbar(error.message || "Ошибка обновления клиента", "error");
    }
  };

  // Импорт CSV-файла с email-адресами для выбранного списка
  const handleCSVUpload = async () => {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const emails = results.data
          .map((row: any) => row.Email)
          .filter((email: string) => email);
        try {
          const res = await fetch("/api/admin/clients/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emails, listId }),
          });
          if (!res.ok) throw new Error("Ошибка импорта CSV");
          showSnackbar("CSV успешно импортирован", "success");
          fetchClients();
        } catch (error: any) {
          console.error("Ошибка импорта CSV:", error);
          showSnackbar(error.message || "Ошибка импорта CSV", "error");
        }
      },
      error: (err) => {
        console.error("Ошибка парсинга CSV:", err);
        showSnackbar("Ошибка парсинга CSV", "error");
      },
    });
  };

  // Фильтруем клиентов по введённому значению (по email)
  const filteredClients = clients.filter((client) =>
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Клиенты в списке
      </Typography>

      {/* Форма добавления нового email */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Новый Email"
          variant="outlined"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <Button variant="contained" onClick={handleAddClient}>
          Добавить
        </Button>
      </Box>

      {/* Импорт CSV */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setCsvFile(e.target.files ? e.target.files[0] : null)
          }
        />
        <Button variant="contained" onClick={handleCSVUpload}>
          Импортировать CSV
        </Button>
      </Box>

      {/* Автодополнение для поиска по email */}
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          freeSolo
          options={clients}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.email
          }
          onInputChange={(event, newInputValue) =>
            setClientSearch(newInputValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск клиента"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Box>

      {/* Список клиентов */}
      <Box>
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Загрузка...</Typography>
          </Box>
        ) : (
          <List>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ListItem
                  key={client.subscriptionId}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {editingSubscriptionId === client.subscriptionId ? (
                    <>
                      <TextField
                        value={editingEmail}
                        onChange={(e) => setEditingEmail(e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <Button onClick={handleUpdateClient} sx={{ ml: 2 }}>
                        Сохранить
                      </Button>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={client.email} />
                      <IconButton onClick={() => handleEditClient(client)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteClient(client.subscriptionId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">
                Нет клиентов по данному запросу
              </Typography>
            )}
          </List>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientsManager;
