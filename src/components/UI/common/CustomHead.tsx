import React from "react";
import { NextSeo } from "next-seo";

interface CustomHeadProps {
  title: string;
  description: string;
  domain: string;
  asPath: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({ title, description, domain, asPath }) => {
  const languages = ["ru", "en", "ua", "pl"];

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          url: `${domain}${asPath}`,
        }}
        twitter={{
          cardType: "summary",
        }}
      />
      {languages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          href={`${domain}/${lang}${asPath}`}
          hrefLang={lang}
        />
      ))}
      <link rel="alternate" href={`${domain}/ru${asPath}`} hrefLang="x-default" />
    </>
  );
};

export default CustomHead;
