// pages/sitemap.xml.ts
import { GetServerSideProps } from 'next';
import { builder } from '@builder.io/react';

// Инициализация Builder.io (если API ключ задан)
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (apiKey) {
  builder.init(apiKey);
} else {
  console.error("Builder.io API key is not defined!");
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Языки, для которых нужно генерировать ссылки
  const languages = ['ru', 'en', 'ua', 'pl'];

  // Получаем все страницы из модели "page"
  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });

  // Базовый URL из переменной окружения или localhost
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
  xml += `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  pagesData.forEach((page) => {
    const pageUrl = page.data?.url;
    if (pageUrl) {
      xml += `  <url>\n`;
      // Выбираем один из вариантов в качестве канонического (например, ru)
      xml += `    <loc>${baseUrl}/ru${pageUrl}</loc>\n`;
      languages.forEach((lang) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${pageUrl}" />\n`;
      });
      // x-default указываем на дефолтный язык (например, ru)
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru${pageUrl}" />\n`;
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
