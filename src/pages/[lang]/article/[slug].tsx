import React from "react";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { builder, BuilderComponent } from "@builder.io/react";
import Header from "@/components/BuilderIO/Header";
import { Box } from "@mui/material";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Page from "@/interfaces/Page";
import CustomHead from "@/components/UI/common/CustomHead";

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
  return (
    <>
      <CustomHead
        title={builderPage?.data?.title || "Article"}
        domain={domain}
        asPath={asPath}
      />
      <Header pages={pages} />
      <Box>
        <BuilderComponent model="article" content={builderPage} />
      </Box>
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

  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  // Приводим pagesData к типу Page[]
  const pages: Page[] = pagesData.map((page: any) => ({
    data: {
      url: page.data?.url || "",
      title: page.data?.title || "",
    },
  }));

  // Определяем домен через переменную окружения или по умолчанию
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const asPath = `/article/${slug}`;

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
