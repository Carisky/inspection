import React from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import Header from "@/components/BuilderIO/Header";
import { GetStaticProps } from "next";
import Page from "@/interfaces/Page";
import { SpeedInsights } from "@vercel/speed-insights/next"
// Проверяем, что переменная окружения существует
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

// Загружаем данные статически
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Получаем содержимое текущей страницы
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/" + ((params?.page as string[])?.join("/") || ""),
      },
    })
    .toPromise();

  // Получаем список всех страниц для меню
  const pages = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  return {
    props: {
      page: page || null,
      pages: pages || [],
    },
    revalidate: 5, // Обновление данных раз в 5 секунд
  };
};

// Генерируем пути для статических страниц
export async function getStaticPaths() {
  const pages = await builder.getAll("page", {
    fields: "data.url",
    options: { noTargeting: true },
  });

  return {
    paths: pages.map((page) => `${page.data?.url}`).filter((url) => url !== "/"),
    fallback: "blocking",
  };
}

// Основной компонент страницы
export default function Index({
  page,
  pages,
}: {
  page: BuilderContent | null;
  pages: Page[];
}) {
  const isPreviewing = useIsPreviewing();

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{page?.data?.title || "Page"}</title>
      </Head>
      {/* Вставляем Header с навигацией */}
      <Header pages={pages} />
      {/* Рендерим контент страницы */}
      <BuilderComponent model="page" content={page || undefined} />


      <SpeedInsights />
    </>
  );
}
