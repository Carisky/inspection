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
  console.log(seoTitle,seoDescription)
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
  console.log("Received segments:", segments);

  // Если segments равны буквально '[[...page]]', считаем, что это пустой массив (главная страница)
  if (segments.length === 1 && segments[0] === "[[...page]]") {
    segments = [];
  }

  const supportedLocales = ["ru", "en", "ua", "pl"];

  // Если в маршруте только один сегмент и он является кодом языка, значит это главная страница
  let urlPath = "/" + segments.join("/");
  if (segments.length === 1 && supportedLocales.includes(segments[0])) {
    urlPath = "/";
  }
  console.log("Resolved urlPath:", urlPath);

  const builderPage = await builder
    .get("page", {
      userAttributes: { urlPath },
    })
    .toPromise();

  if (!builderPage) {
    console.error(`No Builder.io content found for urlPath: "${urlPath}"`);
  }

  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  const pages: Page[] = pagesData.map((page: any) => ({
    data: {
      url: page.data?.url || "",
      title: page.data?.title || "",
    },
  }));

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const asPath = urlPath;

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
