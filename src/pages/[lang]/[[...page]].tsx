import React from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "@/components/BuilderIO/Header";
import Footer from "@/components/BuilderIO/Footer";
import Page from "@/interfaces/Page";
import CustomHead from "@/components/UI/common/CustomHead";
import { useLocaleStore } from "@/store/useLocaleStore";
import Redis from "ioredis";

// Инициализируем Redis-клиент
const redisClient = new Redis(process.env.REDIS_URL || "");

interface PageProps {
  builderPage: BuilderContent | null;
  pages: Page[];
  domain: string;
  asPath: string;
}

const Index: NextPage<PageProps> = ({ builderPage, pages, domain, asPath }) => {
  const isPreviewing = useIsPreviewing();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Получаем текущую локаль из Zustand
  const { locale } = useLocaleStore();

  if (!builderPage && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // Определяем поля SEO в зависимости от локали
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

  const seoTitle =
    builderPage?.data?.[titleField] || builderPage?.data?.title || "Page";
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
            marginTop: isMobile ? "35vh" : "0",
          }}
        >
          <BuilderComponent model="page" content={builderPage || undefined} />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Index;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  let segments = (context.params?.page as string[]) || [];
  if (segments.length === 1 && segments[0] === "[[...page]]") {
    segments = [];
  }

  const supportedLocales = ["ru", "en", "ua", "pl"];
  let urlPath = "/" + segments.join("/");
  if (segments.length === 1 && supportedLocales.includes(segments[0])) {
    urlPath = "/";
  }

  // Ключи для кэширования в Redis
  const cacheKeyPage = `builder:page:${urlPath}`;
  const cacheKeyPages = `builder:pages`;

  // Пытаемся получить данные из кэша
  const cachedPage = await redisClient.get(cacheKeyPage);
  const cachedPages = await redisClient.get(cacheKeyPages);

  let builderPage, pages;
  if (cachedPage && cachedPages) {
    console.log("Cache hit");
    builderPage = JSON.parse(cachedPage);
    pages = JSON.parse(cachedPages);
  } else {
    console.log("Cache miss, fetching from Builder.io");
    // Получаем контент страницы с помощью Builder.io SDK
    builderPage = await builder
      .get("page", {
        userAttributes: { urlPath },
      })
      .toPromise();

    // Получаем данные всех страниц для навигации
    const pagesData = await builder.getAll("page", {
      fields: "data.url,data.title,data.children",
      options: { noTargeting: true },
    });
    pages = pagesData.map((page: any) => ({
      data: {
        url: page.data?.url || "",
        title: page.data?.title || "",
        children: page.data?.children || [],
      },
    }));

    // Кэшируем результаты на 1 час (3600 секунд)
    await redisClient.setex(cacheKeyPage, 3600, JSON.stringify(builderPage));
    await redisClient.setex(cacheKeyPages, 3600, JSON.stringify(pages));
  }

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const asPath = urlPath;

  return {
    props: {
      builderPage: builderPage || null,
      pages,
      domain,
      asPath,
    },
    revalidate: 3600, // ISR: страница пересобирается раз в 1 час
  };
};
