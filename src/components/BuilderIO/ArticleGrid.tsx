// components/ArticleGrid.tsx
import React, { useState, useEffect } from 'react';
import { builder } from '@builder.io/react';
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
} from '@mui/material';

export interface ArticlePreview {
  id?: string; // id может быть undefined
  data: {
    titlePl?: string;
    titleRu?: string;
    titleEn?: string;
    titleUa?: string;
    slug?: string;
    image?: string;
    descriptionPl?: string;
    descriptionRu?: string;
    descriptionEn?: string;
    descriptionUa?: string;
    creationDate?: number;
    category?: {
      id: string;
      model: string;
      value?: {
        nameUa?: string;
        namePl?: string;
        nameEn?: string;
        nameRu?: string;
        slug?: string;
      };
    };
  };
}

interface ArticleGridProps {
  // Если указать slug категории, компонент отфильтрует статьи,
  // иначе выведет все превью.
  filterByCategory?: string;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ filterByCategory }) => {
  const [previews, setPreviews] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreviews() {
      try {
        // Получаем превью статей с includeRefs, чтобы вложенные данные категории были доступны в data.category.value
        const results = (await builder.getAll('article-preview', {
          limit: 100,
          includeRefs: true,
        })) as ArticlePreview[];
        setPreviews(results);
      } catch (error) {
        console.error('Ошибка при получении превью статей:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreviews();
  }, []);

  // Если передан параметр фильтрации, оставляем только статьи, у которых slug категории совпадает.
  const filteredPreviews = filterByCategory
    ? previews.filter((item) => {
        const catSlug = item.data.category?.value?.slug;
        return catSlug === filterByCategory;
      })
    : previews;

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {filteredPreviews.map((preview) => {
          // Определяем заголовок (добавьте свою логику для выбора языка)
          const title =
            preview.data.titleRu ||
            preview.data.titleEn ||
            preview.data.titlePl ||
            preview.data.titleUa ||
            'Без названия';

          // Аналогично для описания
          const description =
            preview.data.descriptionRu ||
            preview.data.descriptionEn ||
            preview.data.descriptionPl ||
            preview.data.descriptionUa ||
            '';

          // Если данные категории доступны, выбираем название
          const categoryName = preview.data.category?.value
            ? preview.data.category.value.nameRu ||
              preview.data.category.value.nameEn ||
              preview.data.category.value.namePl ||
              preview.data.category.value.nameUa
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={preview.id || Math.random().toString()}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {preview.data.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={preview.data.image}
                    alt={title}
                  />
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {description}
                  </Typography>
                </CardContent>
                {preview.data.slug && (
                  <CardActions>
                    <Button size="small" href={`/article${preview.data.slug}`}>
                      Читать далее
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
