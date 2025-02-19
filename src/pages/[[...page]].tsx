import React from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import Header from "@/components/BuilderIO/Header";
import { GetStaticProps, GetStaticPaths } from "next";
import { Box } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Page from "@/interfaces/Page";
import Footer from "@/components/BuilderIO/Footer";

// Проверяем, что переменная окружения существует
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

interface PageProps {
  builderPage: BuilderContent | null;
  pages: Page[];
}

export default function Index({ builderPage, pages }: PageProps) {
  const isPreviewing = useIsPreviewing();

  if (!builderPage && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{builderPage?.data?.title || "Page"}</title>
      </Head>
      {/* Передаём список страниц в Header */}
      <Header pages={pages} />
      <Box sx={{ minHeight: "80vh", marginTop: builderPage?.data?.title == "Home"? "0":"7vh" }}>
        <BuilderComponent model="page" content={builderPage || undefined} />
      </Box>
      <Footer/>
      <SpeedInsights />
    </>
  );
}

// Если вы хотите предварительно сгенерировать пути — можно получить их,
// но для корректной работы превью можно вернуть пустой массив с fallback: "blocking"
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const urlPath = "/" + ((params?.page as string[])?.join("/") || "");

  // Загружаем содержимое текущей страницы
  const builderPage = await builder
    .get("page", {
      userAttributes: {
        urlPath,
      },
    })
    .toPromise();

  // Загружаем список страниц для меню
  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  return {
    props: {
      builderPage: builderPage || null,
      pages: pagesData || [],
    },
    revalidate: 5, // ISR: обновление данных каждые 5 секунд
  };
};
