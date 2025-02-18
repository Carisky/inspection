import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

interface ArticlePreviewProps {
  title: string;
  image: string;
  excerpt: string;
  slug: string;
}

interface ArticlePreviewComponent extends React.FC<ArticlePreviewProps> {
  getInitialProps?: () => {};
}

const ArticlePreview: ArticlePreviewComponent = ({ title, image, excerpt, slug }) => {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        mb: 4,
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{height:"300px", objectFit: "cover", aspectRatio:"1/1" }}
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {excerpt}
        </Typography>
        <Link href={`/article/${slug}`} passHref>
         <Box>Read more</Box>
        </Link>
      </Box>
    </Box>
  );
};

// Добавляем пустой getInitialProps, чтобы Builder.io не пытался его прочитать
ArticlePreview.getInitialProps = () => ({});

export default ArticlePreview;
