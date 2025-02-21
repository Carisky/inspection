// src/pages/admin/index.tsx
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';

import Dashboard from './elements/Dashboard';
import Users from './elements/Users';
import Settings from './elements/Settings';
import Newsletter from './elements/Newsletter';
import EmailTemplateEditor from './components/EmailTemplateEditor';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<
    'dashboard' | 'users' | 'settings' | 'newsletter' | 'editor'
  >('dashboard');

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'newsletter':
        return <Newsletter />;
      case 'editor':
        return <EmailTemplateEditor />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Верхняя панель */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Админ-панель
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Левая навигация */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem component="li" onClick={() => setSelectedTab('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Панель управления" />
            </ListItem>
            <ListItem component="li" onClick={() => setSelectedTab('users')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Пользователи" />
            </ListItem>
            <ListItem component="li" onClick={() => setSelectedTab('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItem>
            <ListItem component="li" onClick={() => setSelectedTab('newsletter')}>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Newsletter" />
            </ListItem>
            <ListItem component="li" onClick={() => setSelectedTab('editor')}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Editor" />
            </ListItem>
          </List>
          <Divider />
          {/* Дополнительные элементы навигации */}
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie || '';
  const cookies = parse(cookieHeader);

  // Простейшая проверка наличия токена
  if (!cookies.token) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false
      }
    };
  }

  return { props: {} };
};

export default AdminDashboard;
