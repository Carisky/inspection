import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import pallete from "@/palette";
import Page from "@/interfaces/Page";
import Link from "next/link";
import { useInitLocale } from "@/stores/useLocaleStore";
import { Call, Mail, Map, Home } from "@mui/icons-material";
interface HeaderProps {
  pages: Page[];
}

const DesktopHeader = ({ pages }: HeaderProps) => {
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: pallete.common_colors.main_color,
          width: "100vw",
          height: "3vh",
        }}
      />
      <Box
        sx={{
          width: "100vw",
          backgroundColor: pallete.common_colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "2%",
          paddingBottom: "2%",
        }}
      >
        <Box
          sx={{
            width: "80vw",
            height: "100%",
            display: "flex",
          }}
        >
          <Box>
            <Image
              src="/images/assets/nav/cropped-logo-z-napisem-z-R_przez.png"
              alt="Company Logo"
              width={200}
              height={200}
              priority
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, auto)",
              gap: 2,
              flexGrow: 1,
              color: pallete.common_colors.accent,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Map sx={{ marginRight:"10px", color: pallete.common_colors.main_color }} />
              ul. Rycerska 9, 41-902 Bytom
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Call sx={{ marginRight:"10px", color: pallete.common_colors.main_color }} />
              +48 (32) 282 90 62
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Call sx={{ marginRight:"10px", color: pallete.common_colors.main_color }} />
              +48 (32) 281 34 02
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Mail sx={{ marginRight:"10px", color: pallete.common_colors.main_color }} />
              office@tsl-group.pl
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "7vh",
          backgroundColor: pallete.common_colors.main_color,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            backgroundColor: pallete.elements.nav,
            height: "10vh",
            width: "80vw",
            margin: "auto",
            top: "3vh",
            left: "10%",
            zIndex: 10,
          }}
        >
          {pages && pages.length > 0 ? (
            pages.map((page) => (
              <Box
                key={page.data.url}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: pallete.common_colors.white,
                  ":hover": {
                    backgroundColor: pallete.elements.nav_element_hover,
                    transition: "ease-in",
                  },
                }}
              >
                <a
                  href={page.data.url}
                  style={{
                    color: pallete.common_colors.white,
                    textDecoration: "none",
                  }}
                >
                  {page.data.url ==="/"? <Home/>:page.data.title}
                </a>
              </Box>
            ))
          ) : (
            <Box>Меню не доступно</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const MobileHeader = ({ pages }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: pallete.common_colors.main_color,
          width: "100vw",
          height: "3vh",
        }}
      />
      <Box
        sx={{
          width: "100vw",
          backgroundColor: pallete.common_colors.background,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
        }}
      >
        <Box>
          <Image
            src="/images/assets/nav/cropped-logo-z-napisem-z-R_przez.png"
            alt="Company Logo"
            width={150}
            height={150}
            priority
          />
        </Box>
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{ color: pallete.common_colors.white }}
        >
          <MenuIcon
            sx={{
              color: pallete.common_colors.main_color,
              height: "40px",
              width: "40px",
            }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          backgroundColor: pallete.common_colors.main_color,
          width: "100vw",
          height: "3vh",
        }}
      />
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, paddingTop: "10vh" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {pages.map((page) => (
              <React.Fragment key={page.data.url}>
                <ListItemButton>
                  <Link href={page.data.url}>
                    <Typography
                      sx={{
                        color: pallete.common_colors.main_color,
                        fontWeight: 700,
                        fontSize: 20,
                        marginTop: "10px",
                      }}
                    >
                      {page.data.title}
                    </Typography>
                  </Link>
                </ListItemButton>
                <Divider sx={{ bgcolor: "grey.600", my: 2 }} />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

const Header = ({ pages }: HeaderProps) => {
  useInitLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10 }}>
      <MobileHeader pages={pages} />
    </Box>
  ) : (
    <DesktopHeader pages={pages} />
  );
};

export default Header;
