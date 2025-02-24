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

// Инициализация Builder.io (если API ключ задан)
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

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

  if (!builderPage && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <CustomHead
        title={builderPage?.data?.title || "Page"}
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
        <Box sx={{ marginTop: isMobile ? "35vh" : "0" }}>
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
  // Вычисляем путь страницы на основе параметров URL
  const urlPath = "/" + ((context.params?.page as string[])?.join("/") || "");

  // Загружаем содержимое текущей страницы
  const builderPage = await builder
    .get("page", {
      userAttributes: { urlPath },
    })
    .toPromise();

  // Загружаем список страниц для меню
  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  // Преобразуем pagesData к типу Page[]
  const pages: Page[] = pagesData.map((page: any) => ({
    data: {
      url: page.data?.url || "",
      title: page.data?.title || "",
    },
  }));

  // Используем переменную окружения для домена или http://localhost:3000 по умолчанию
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // asPath вычисляем как urlPath, т.к. resolvedUrl недоступен в getStaticProps
  const asPath = urlPath;

  return {
    props: {
      builderPage: builderPage || null,
      pages,
      domain,
      asPath,
    },
    revalidate: 5, // ISR: обновление данных каждые 5 секунд
  };
};
