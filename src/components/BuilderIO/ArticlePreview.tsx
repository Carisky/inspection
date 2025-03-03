import React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import pallete from "@/palette";
import { useLocaleStore } from "@/store/useLocaleStore";
import Title from "../UI/common/Title";
import { motion } from "framer-motion";

interface ArticlePreviewProps {
  title: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  image: string;
  excerpt: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  slug: string;
}

// Функция для получения перевода по текущей локали
const getTranslation = (
  translations: { ru?: string; en?: string; ua?: string; pl?: string },
  locale: string
): string => {
  return translations[locale as keyof typeof translations] || translations.ru || "";
};

const leftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const rightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  image,
  excerpt,
  slug,
}) => {
  const { locale } = useLocaleStore();

  // Маппинг переводов для кнопки "Read more"
  const readMoreTexts: Record<string, string> = {
    ru: "Читать далее",
    en: "Read more",
    ua: "Читати далі",
    pl: "Czytaj więcej",
  };
  const readMoreText = readMoreTexts[locale] || readMoreTexts.en;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 2,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        mb: 4,
        p: 2,
      }}
    >
      {/* Левая часть: Заголовок и изображение */}
      <Box
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={leftVariants}
        transition={{ duration: 0.5 }}
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Link href={`/article/${slug}`} passHref>
          <Title text={getTranslation(title, locale)} />
        </Link>
        <Link href={`/article/${slug}`} passHref>
          <Box
            component="img"
            src={image}
            alt={getTranslation(title, locale)}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Link>
      </Box>

      {/* Правая часть: Описание и кнопка */}
      <Box
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={rightVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: { xs: "1vh", md: 0 },
        }}
      >
        <Link href={`/article/${slug}`} passHref>
          <Typography variant="body1" color="text.secondary">
            {getTranslation(excerpt, locale)}
          </Typography>
        </Link>
        <Link href={`/article/${slug}`} passHref>
          <Button
            variant="contained"
            sx={{
              marginTop: "5vh",
              backgroundColor: pallete.common_colors.main_color,
              alignSelf: "center",
            }}
          >
            {readMoreText}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ArticlePreview;
