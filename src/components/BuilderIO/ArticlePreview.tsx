import React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import Title from "../UI/common/Title";
import pallete from "@/palette";
import { useLocaleStore } from "@/store/useLocaleStore";

interface ArticlePreviewProps {
  title: string;
  image: string;
  excerpt: string;
  slug: string;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  image,
  excerpt,
  slug,
}) => {
  const { locale } = useLocaleStore();

  // Маппинг локали на перевод кнопки "Read more"
  const readMoreTexts: Record<string, string> = {
    ru: "Читать далее",
    en: "Read more",
    ua: "Читати далі",
    pl: "Czytaj więcej",
  };

  const readMoreText = readMoreTexts[locale] || readMoreTexts.en;

  return (
    <Box
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
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Link href={`/article/${slug}`} passHref>
          <Title text={title} />
        </Link>
        <Link href={`/article/${slug}`} passHref>
          <Box
            component="img"
            src={image}
            alt={title}
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
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: "1vh",
        }}
      >
        <Link href={`/article/${slug}`} passHref>
          <Typography variant="body1" color="text.secondary">
            {excerpt}
          </Typography>
        </Link>
        <Link href={`/article/${slug}`} passHref>
          <Button
            variant="contained"
            sx={{
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
