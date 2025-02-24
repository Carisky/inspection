import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Paper,
  Grid,
  SnackbarCloseReason,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ClientsManager from './ClientsManager';

interface MailingList {
  id: number;
  name: string;
  description?: string;
}

const MailingListsManager: React.FC = () => {
  const [lists, setLists] = useState<MailingList[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<MailingList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  // Вкладки: 0 - управление списками, 1 - создание нового списка
  const [tabIndex, setTabIndex] = useState(0);

  // Уведомления (тосты)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/lists');
      if (!res.ok) throw new Error('Ошибка получения списков');
      const data = await res.json();
      setLists(data.data);
    } catch (error: any) {
      console.error('Ошибка получения списков:', error);
      showSnackbar(error.message || 'Ошибка получения списков', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName) return;
    try {
      const res = await fetch('/api/admin/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription,
        }),
      });
      if (!res.ok) throw new Error('Ошибка создания списка');
      showSnackbar('Список создан', 'success');
      setNewListName('');
      setNewListDescription('');
      fetchLists();
      setTabIndex(0); // переключаемся обратно на управление списками
    } catch (error: any) {
      console.error('Ошибка создания списка:', error);
      showSnackbar(error.message || 'Ошибка создания списка', 'error');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Управление списками рассылки
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Список рассылки" />
        <Tab label="Создать новый список" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Autocomplete
                  options={lists}
                  getOptionLabel={(option) => option.name}
                  value={selectedList}
                  onChange={(event, newValue) => setSelectedList(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Выберите список" variant="outlined" fullWidth />
                  )}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {selectedList && (
                <Button variant="outlined" onClick={() => setSelectedList(null)}>
                  Сбросить выбор
                </Button>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            {selectedList ? (
              <ClientsManager listId={selectedList.id} />
            ) : (
              <Typography variant="body1">
                Пожалуйста, выберите список для управления клиентами.
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Создать новый список
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Название списка"
              variant="outlined"
              fullWidth
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <TextField
              label="Описание"
              variant="outlined"
              fullWidth
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
            />
            <Button variant="contained" onClick={handleCreateList}>
              Создать список
            </Button>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MailingListsManager;
