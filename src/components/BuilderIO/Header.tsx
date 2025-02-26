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
import { Call, Mail, Map, Home } from "@mui/icons-material";
import Link from "next/link";
import pallete from "@/palette";
import Page from "@/interfaces/Page";
import { useInitLocale } from "@/store/useLocaleStore";
import LanguageSwitcher from "../UI/common/LanguageSwitcher";

interface HeaderProps {
  pages: Page[];
}

const DesktopHeader = ({ pages }: HeaderProps) => {
  // Храним URL папки, над которой сейчас наведен курсор
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  return (
    <Box>
      {/* Верхняя полоска */}
      <Box
        sx={{
          backgroundColor: pallete.common_colors.main_color,
          width: "100vw",
          height: "3vh",
        }}
      />
      {/* Контактная информация */}
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
              <Map sx={{ marginRight: "10px", color: pallete.common_colors.main_color }} />
              ul. Rycerska 9, 41-902 Bytom
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Call sx={{ marginRight: "10px", color: pallete.common_colors.main_color }} />
              +48 (32) 282 90 62
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Call sx={{ marginRight: "10px", color: pallete.common_colors.main_color }} />
              +48 (32) 281 34 02
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Mail sx={{ marginRight: "10px", color: pallete.common_colors.main_color }} />
              office@tsl-group.pl
            </Box>
          </Box>
          <LanguageSwitcher direction="column" />
        </Box>
      </Box>
      {/* Основное меню */}
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
            pages.map((page) => {
              const hasChildren =
                page.data.children && page.data.children.length > 0;
              return (
                <Box
                  key={page.data.url}
                  onMouseEnter={() => {
                    if (hasChildren) setActiveFolder(page.data.url);
                  }}
                  onMouseLeave={() => {
                    if (hasChildren) setActiveFolder(null);
                  }}
                  sx={{
                    position: "relative",
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
                  <Link
                    href={page.data.url}
                    style={{
                      color: pallete.common_colors.white,
                      textDecoration: "none",
                    }}
                  >
                    {page.data.url === "/" ? <Home /> : page.data.title}
                  </Link>
                  {hasChildren && activeFolder === page.data.url && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: pallete.elements.nav,
                        padding: "0.5rem",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                        zIndex: 20,
                      }}
                    >
                      {page.data.children!.map((child) => (
                        <Box key={child.url} sx={{ padding: "0.5rem 1rem" }}>
                          <Link
                            href={"/"}
                            style={{
                              color: pallete.common_colors.white,
                              textDecoration: "none",
                            }}
                          >
                            <Typography>{child.title}</Typography>
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })
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
  // Храним развёрнутое состояние для папок (ключ – URL родительской страницы)
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleFolder = (url: string) => {
    setExpandedFolders((prev) => ({ ...prev, [url]: !prev[url] }));
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
        <IconButton onClick={toggleDrawer(true)} sx={{ color: pallete.common_colors.white }}>
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
            {pages.map((page) => {
              const hasChildren =
                page.data.children && page.data.children.length > 0;
              return (
                <React.Fragment key={page.data.url}>
                  <ListItemButton
                    onClick={() => hasChildren && toggleFolder(page.data.url)}
                  >
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
                  {hasChildren && expandedFolders[page.data.url] && (
                    <Box sx={{ pl: 4 }}>
                      {page.data.children!.map((child) => (
                        <ListItemButton key={child.url}>
                          <Link href={"/"}>
                            <Typography
                              sx={{
                                color: pallete.common_colors.main_color,
                                fontSize: 18,
                                marginTop: "10px",
                              }}
                            >
                              {child.title}
                            </Typography>
                          </Link>
                        </ListItemButton>
                      ))}
                    </Box>
                  )}
                  <Divider sx={{ bgcolor: "grey.600", my: 2 }} />
                </React.Fragment>
              );
            })}
          </List>
          {/* Переключатель языков */}
          <Box sx={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <LanguageSwitcher direction="row" />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

const Header = ({ pages }: HeaderProps) => {
  console.log(pages)
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
