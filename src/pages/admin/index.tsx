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
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';

import Dashboard from './elements/Dashboard';
import Users from './elements/Users';
import Settings from './elements/Settings';
import Newsletter from './elements/Newsletter';
import EmailTemplateEditor from './components/EmailTemplateEditor';
import MailingListsManager from './components/MailingListsManager';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { verifyToken } from '@/backend/utils/auth';

const drawerWidth = 240;

// Компонент для вложенных вкладок в разделе Newsletter
const NewsletterDashboard = () => {
  // Возможные вкладки: рассылка, редактор шаблонов, списки рассылки
  const [subTab, setSubTab] = useState<'send' | 'templateEditor' | 'mailingLists'>('send');

  const handleSubTabChange = (
    event: React.SyntheticEvent,
    newValue: 'send' | 'templateEditor' | 'mailingLists'
  ) => {
    setSubTab(newValue);
  };

  return (
    <Box>
      <Tabs value={subTab} onChange={handleSubTabChange}>
        <Tab label="Рассылка" value="send" />
        <Tab label="Редактор шаблонов" value="templateEditor" />
        <Tab label="Списки рассылки" value="mailingLists" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {subTab === 'send' && <Newsletter />}
        {subTab === 'templateEditor' && <EmailTemplateEditor />}
        {subTab === 'mailingLists' && <MailingListsManager />}
      </Box>
    </Box>
  );
};


const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<
    'dashboard' | 'users' | 'settings' | 'newsletter'
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
        return <NewsletterDashboard />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Админ-панель
          </Typography>
        </Toolbar>
      </AppBar>
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
            <ListItem onClick={() => setSelectedTab('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Панель управления" />
            </ListItem>
            <ListItem onClick={() => setSelectedTab('users')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Пользователи" />
            </ListItem>
            <ListItem onClick={() => setSelectedTab('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Настройки" />
            </ListItem>
            <ListItem onClick={() => setSelectedTab('newsletter')}>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary="Newsletter" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
    <CssBaseline />
    </ThemeProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parse(context.req.headers.cookie || '');
  const token = cookies.token;

  if (!token || !verifyToken(token)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      }
    };
  }

  return { props: {} };
};

export default AdminDashboard;
