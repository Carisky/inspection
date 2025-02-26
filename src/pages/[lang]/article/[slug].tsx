import React from "react";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { builder, BuilderComponent, useIsPreviewing } from "@builder.io/react";
import DefaultErrorPage from "next/error";
import Header from "@/components/BuilderIO/Header";
import { Box, useMediaQuery } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Page from "@/interfaces/Page";
import CustomHead from "@/components/UI/common/CustomHead";
import { useLocaleStore } from "@/store/useLocaleStore";
import theme from "@/theme";
import Footer from "@/components/BuilderIO/Footer";

// Инициализация Builder.io (если API ключ задан)
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

interface ArticlePageProps {
  builderPage: any;
  pages: Page[];
  domain: string;
  asPath: string;
}

const ArticlePage: NextPage<ArticlePageProps> = ({
  builderPage,
  pages,
  domain,
  asPath,
}) => {
  // Получаем текущую локаль из Zustand
  const { locale } = useLocaleStore();
  const isPreviewing = useIsPreviewing();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Если контент не найден и не в режиме предпросмотра, возвращаем 404
  if (!builderPage && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // Определяем SEO-поля в зависимости от локали
  let titleField = "";
  let descriptionField = "";
  switch (locale) {
    case "ru":
      titleField = "seoTitleRu";
      descriptionField = "seoDescriptionRu";
      break;
    case "en":
      titleField = "seoTitleEn";
      descriptionField = "seoDescriptionEn";
      break;
    case "ua":
      titleField = "seoTitleUa";
      descriptionField = "seoDescriptionUa";
      break;
    case "pl":
      titleField = "seoTitlePl";
      descriptionField = "seoDescriptionPl";
      break;
    default:
      titleField = "seoTitleRu";
      descriptionField = "seoDescriptionRu";
  }

  // Берём SEO-данные из модели Article. Если поля отсутствуют, подставляем title из контента.
  const seoTitle =
    builderPage?.data?.[titleField] || builderPage?.data?.title || "Article";
  const seoDescription = builderPage?.data?.[descriptionField] || "";

  return (
    <>
      <CustomHead
        title={seoTitle}
        description={seoDescription}
        domain={domain}
        asPath={asPath}
      />
      <Header pages={pages} />
      <Box
        sx={{
          minHeight: "80vh",
          marginTop: builderPage?.data?.title === "Home" ? "0" : "7vh",
        }}
      >
        <Box
          sx={{
            paddingLeft: "10vw",
            paddingRight: "10vw",
            marginTop: isMobile ? "25vh" : "0",
          }}
        >
          {/* Используем модель "article" */}
          <BuilderComponent model="article" content={builderPage || undefined} />
        </Box>
      </Box>
      <Footer />
      <SpeedInsights />
    </>
  );
};

export default ArticlePage;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async (context) => {
  const slug = context.params?.slug as string;

  const builderPage = await builder
    .get("article", {
      userAttributes: {
        urlPath: `/article/${slug}`,
      },
    })
    .toPromise();

  // Получаем все страницы с нужными полями (url, title и children)
  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title,data.children",
    options: { noTargeting: true },
  });

  // Приводим pagesData к типу Page[]
  const pages: Page[] = pagesData.map((page: any) => ({
    data: {
      url: page.data?.url || "",
      title: page.data?.title || "",
      children: page.data?.children || [],
    },
  }));

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const asPath = `/article/${slug}`;

  return {
    props: {
      builderPage: builderPage || null,
      pages,
      domain,
      asPath,
    },
    revalidate: 5,
  };
};
