// pages/admin/index.tsx или pages/admin/dashboard.tsx
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { JSX, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  Stack,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";

import Dashboard from "./elements/Dashboard";
import Users from "./elements/Users";
import Settings from "./elements/Settings";
import NewsletterDashboard from "./elements/NewsletterDashboard";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import { verifyToken } from "@/backend/utils/auth";

const drawerWidth = 240;

type TabKey = "dashboard" | "users" | "settings" | "newsletter";

interface TabItem {
  key: TabKey;
  label: string;
  icon: JSX.Element;
  component: JSX.Element;
}

const tabs: TabItem[] = [
  {
    key: "dashboard",
    label: "Панель управления",
    icon: <DashboardIcon />,
    component: <Dashboard />,
  },
  {
    key: "users",
    label: "Пользователи",
    icon: <PeopleIcon />,
    component: <Users />,
  },
  {
    key: "settings",
    label: "Настройки",
    icon: <SettingsIcon />,
    component: <Settings />,
  },
  {
    key: "newsletter",
    label: "Newsletter",
    icon: <EmailIcon />,
    component: <NewsletterDashboard />,
  },
];

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabKey>("dashboard");

  // Определяем текущую вкладку для отображения контента
  const currentTab = tabs.find((tab) => tab.key === selectedTab);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <Stack spacing={2}>
              {tabs.map((tab) => (
                <ListItemButton
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  sx={{ cursor: "pointer" }}
                  selected={selectedTab === tab.key}
                >
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <ListItemText primary={tab.label} />
                </ListItemButton>
              ))}
            </Stack>
            <Divider />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {currentTab?.component}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parse(context.req.headers.cookie || "");
  const token = cookies.token;

  if (!token || !verifyToken(token)) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default AdminDashboard;
