import React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import Title from "../UI/common/Title";
import pallete from "@/palette";

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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Вертикально на мобилке, горизонтально на десктопе
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
        <Title text={title} />
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
      </Box>

      {/* Правая часть: Описание и кнопка */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", marginTop:"1vh" }}>
        <Typography variant="body1" color="text.secondary">
          {excerpt}
        </Typography>
        <Link href={`/article/${slug}`} passHref>
          <Button variant="contained" sx={{ backgroundColor:pallete.common_colors.main_color,alignSelf: "center" }}>
            Read more
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ArticlePreview;
