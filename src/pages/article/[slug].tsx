// pages/article/[slug].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { builder, BuilderComponent } from "@builder.io/react";
import Header from "@/components/BuilderIO/Header";
import { Box } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Page from "@/interfaces/Page";

const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

interface ArticlePageProps {
  builderPage: any;
  pages: Page[];
}

export default function ArticlePage({ builderPage, pages }: ArticlePageProps) {
  return (
    <>
      <Header pages={pages} />
      <Box>
        <BuilderComponent model="article" content={builderPage} />
      </Box>
      <SpeedInsights />
    </>
  );
}

// Для динамической генерации путей возвращаем пустой массив с fallback: "blocking"
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

// Получаем данные для конкретной статьи по slug и список страниц для меню
export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug as string;

  const builderPage = await builder
    .get("article", {
      userAttributes: {
        urlPath: `/article/${slug}`,
      },
    })
    .toPromise();

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
