// components/CustomHead.tsx
import React from "react";
import Head from "next/head";

interface CustomHeadProps {
  title?: string;
  domain: string;
  asPath: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({ title = "Page", domain, asPath }) => {
  const languages = ["ru", "en", "ua", "pl"];

  return (
    <Head>
      <title>{title}</title>
      {languages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          href={`${domain}/${lang}${asPath}`}
          hrefLang={lang}
        />
      ))}
      <link rel="alternate" href={`${domain}/ru${asPath}`} hrefLang="x-default" />
    </Head>
  );
};

export default CustomHead;
