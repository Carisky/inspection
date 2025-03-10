import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Call,
  Mail,
  Map,
  Home,
  ChevronLeft,
  ChevronRight,
  TextSnippet,
} from "@mui/icons-material";
import Link from "next/link";
import pallete from "@/palette";
import Page from "@/interfaces/Page";
import LanguageSwitcher from "../UI/common/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  pages: Page[];
}

const itemsPerPage = 10;

const DesktopHeader = ({ pages }: HeaderProps) => {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const totalPages = Math.ceil(pages.length / itemsPerPage);
  const visiblePages = pages.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection("prev");
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection("next");
      setCurrentPage(currentPage + 1);
    }
  };

  // Обновлённые варианты анимации с процентными значениями
  const variants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

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
      <Box
        sx={{
          width: "100vw",
          backgroundColor: pallete.common_colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingY: "2%",
        }}
      >
        {/* Внутренний контейнер шириной ~80% */}
        <Box
          sx={{
            width: "90vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Логотип слева */}
          <Box>
            <Link href={"/"}>
              <Image
                src="/images/assets/nav/cropped-logo-z-napisem-z-R_przez.png"
                alt="Company Logo"
                width={200}
                height={200}
                priority
              />
            </Link>
          </Box>

          {/* 4 колонки по 2 строки каждая */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridAutoRows: "auto",
              gap: 0,
              flexGrow: 1,
              marginX: 6,
              marginY: 6,
              color: pallete.common_colors.accent,
            }}
          >
            {/* Колонка 1: Адрес + Email */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Map sx={{ mr: 1, color: pallete.common_colors.main_color }} />
                <Typography>ul. Rycerska 9, 41-902 Bytom</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Mail sx={{ mr: 1, color: pallete.common_colors.main_color }} />
                <Typography>tsl-silesia.com.pl</Typography>
              </Box>
            </Box>

            {/* Колонка 2: Два номера телефона */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Call sx={{ mr: 1, color: pallete.common_colors.main_color }} />
                <Typography>+48 (32) 282 90 62</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Call sx={{ mr: 1, color: pallete.common_colors.main_color }} />
                <Typography>+48 (32) 281 34 02</Typography>
              </Box>
            </Box>

            {/* Колонка 3: NIP + Regon */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextSnippet
                  sx={{ mr: 1, color: pallete.common_colors.main_color }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: pallete.common_colors.accent }}
                >
                  NIP: PL6262721695
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextSnippet
                  sx={{ mr: 1, color: pallete.common_colors.main_color }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: pallete.common_colors.accent }}
                >
                  Regon: 278125418
                </Typography>
              </Box>
            </Box>

            {/* Колонка 4: ISO + AEO */}
            <Box>
              <Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Можете заменить на свою иконку/бэйдж для AEO */}
                <TextSnippet sx={{ mr: 1, color: pallete.common_colors.main_color }}/>
                <Typography
                  variant="body2"
                  sx={{ color: pallete.common_colors.accent }}
                >
                  Pl014435/U
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* Можете заменить на свою иконку/бэйдж для AEO */}
                <TextSnippet sx={{ mr: 1, color: pallete.common_colors.main_color }}/>
                <Typography
                  variant="body2"
                  sx={{ color: pallete.common_colors.accent }}
                >
                  PLAEOF330000100009
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Переключатель языка справа */}
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
            alignItems: "center",
            backgroundColor: pallete.elements.nav,
            height: "10vh",
            width: "80vw",
            margin: "auto",
            top: "3vh",
            left: "10%",
            zIndex: 10,
          }}
        >
          {currentPage > 0 && (
            <IconButton onClick={handlePrevPage}>
              <ChevronLeft sx={{ color: pallete.common_colors.white }} />
            </IconButton>
          )}

          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {visiblePages.map((page) => {
                  const hasChildren =
                    page.data.children && page.data.children.length > 0;
                  return (
                    <Box
                      key={page.data.url}
                      onMouseEnter={() =>
                        hasChildren && setActiveFolder(page.data.url)
                      }
                      onMouseLeave={() => hasChildren && setActiveFolder(null)}
                      sx={{
                        position: "relative",
                        flexGrow: 1,
                        display: "flex",
                        height: "100%",
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
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
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
                            <Box
                              key={child.url}
                              sx={{ padding: "0.5rem 1rem" }}
                            >
                              <Link
                                href={child.url!}
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
                })}
              </motion.div>
            </AnimatePresence>
          </Box>

          {currentPage < totalPages - 1 && (
            <IconButton onClick={handleNextPage}>
              <ChevronRight sx={{ color: pallete.common_colors.white }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const MobileHeader = ({ pages }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean;
  }>({});

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
                          <Link href={child.url!}>
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
          <Box
            sx={{ padding: "1rem", display: "flex", justifyContent: "center" }}
          >
            <LanguageSwitcher direction="row" />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

const Header = ({ pages }: HeaderProps) => {
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
