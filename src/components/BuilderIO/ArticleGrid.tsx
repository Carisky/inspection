// components/ArticleGrid.tsx
import React, { useState, useEffect } from "react";
import { builder } from "@builder.io/react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import { useLocaleStore } from "@/store/useLocaleStore";
import pallete from "@/palette";
import Link from "next/link";

export interface ArticlePreview {
  id?: string;
  data: {
    titlePl?: string | { id: string; model: string; value?: string };
    titleRu?: string | { id: string; model: string; value?: string };
    titleEn?: string | { id: string; model: string; value?: string };
    titleUa?: string | { id: string; model: string; value?: string };
    slug?: string;
    link?: string;
    image?: string;
    url?: string; // Добавляем свойство url
    descriptionPl?: string | { id: string; model: string; value?: string };
    descriptionRu?: string | { id: string; model: string; value?: string };
    descriptionEn?: string | { id: string; model: string; value?: string };
    descriptionUa?: string | { id: string; model: string; value?: string };
    creationDate?: number;
    category?: {
      id: string;
      model: string;
      value?: {
        nameUa?: string | { id: string; model: string; value?: string };
        namePl?: string | { id: string; model: string; value?: string };
        nameEn?: string | { id: string; model: string; value?: string };
        nameRu?: string | { id: string; model: string; value?: string };
        slug?: string;
      };
    };
  };
}

interface ArticleGridProps {
  filterByCategory?: string;
}

// Функция для извлечения строкового значения
const getStringValue = (field: any): string => {
  if (typeof field === "string") return field;
  if (
    field &&
    typeof field === "object" &&
    "value" in field &&
    typeof field.value === "string"
  ) {
    return field.value;
  }
  return "";
};

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  filterByCategory,
}) => {
  const [previews, setPreviews] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocaleStore();

  // Маппинг переводов для кнопки "Read more"
  const readMoreTexts: Record<string, string> = {
    ru: "Читать далее",
    en: "Read more",
    ua: "Читати далі",
    pl: "Czytaj więcej",
  };
  const readMoreText = readMoreTexts[locale] || readMoreTexts.en;

  useEffect(() => {
    async function fetchPreviews() {
      console.log("Запрос превью...");
      try {
        const results = (await builder.getAll("article-preview", {
          limit: 100,
          includeRefs: true,
        })) as ArticlePreview[];
        console.log("Полученные данные:", results);
        setPreviews(results);
      } catch (error) {
        console.error("Ошибка при получении превью статей:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreviews();
  }, []);

  const filteredPreviews = filterByCategory
    ? previews.filter((item) => {
        const catSlug = item.data.category?.value?.slug;
        return catSlug === filterByCategory;
      })
    : previews;

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {filteredPreviews.map((preview) => {
          // Выбор нужного поля для заголовка на основе локали
          const titleField = `title${
            locale.charAt(0).toUpperCase() + locale.slice(1)
          }`;
          const rawTitle =
            preview.data[titleField as keyof typeof preview.data] ||
            preview.data.titleRu ||
            preview.data.titleEn ||
            preview.data.titlePl ||
            preview.data.titleUa;
          const title = getStringValue(rawTitle) || "Без названия";

          // Аналогично для описания
          const descriptionField = `description${
            locale.charAt(0).toUpperCase() + locale.slice(1)
          }`;
          const rawDescription =
            preview.data[descriptionField as keyof typeof preview.data] ||
            preview.data.descriptionRu ||
            preview.data.descriptionEn ||
            preview.data.descriptionPl ||
            preview.data.descriptionUa;
          const description = getStringValue(rawDescription);

          // Выбор названия категории
          const categoryNameField = `name${
            locale.charAt(0).toUpperCase() + locale.slice(1)
          }`;
          let categoryName = "";
          if (preview.data.category?.value) {
            const rawCategoryName =
              preview.data.category.value[
                categoryNameField as keyof typeof preview.data.category.value
              ] ||
              preview.data.category.value.nameRu ||
              preview.data.category.value.nameEn ||
              preview.data.category.value.namePl ||
              preview.data.category.value.nameUa;
            categoryName = getStringValue(rawCategoryName);
          }

          // Определяем URL для статьи: если есть link, то он имеет приоритет, иначе формируем на основе slug
          const articleUrl =
            preview.data.link || `/article/${preview.data.slug}`;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={preview.id || Math.random().toString()}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {preview.data.image && (
                  <Link href={articleUrl}>
                    <CardMedia
                      component="img"
                      image={preview.data.image}
                      alt={title}
                      sx={{
                        aspectRatio: "1/1",
                        objectFit: "contain",
                        height: "300",
                        width: "300",
                      }}
                    />
                  </Link>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {title}
                  </Typography>
                  {categoryName && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Категория:</strong> {categoryName}
                    </Typography>
                  )}
                  <Link href={articleUrl}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {description}
                    </Typography>
                  </Link>
                </CardContent>
                {(preview.data.link || preview.data.slug) && (
                  <CardActions>
                    <Button
                      variant={"contained"}
                      size="small"
                      sx={{
                        backgroundColor: pallete.common_colors.main_color,
                      }}
                      href={articleUrl}
                    >
                      {readMoreText}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ArticleGrid;
