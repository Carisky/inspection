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
  // Задайте языки, для которых нужно генерировать ссылки
  const languages = ['en', 'ru', 'ua', 'pl'];

  // Получаем все страницы из Builder.io модели "page"
  const pagesData = await builder.getAll("page", {
    fields: "data.url,data.title",
    options: { noTargeting: true },
  });
  console.log('Полученные страницы:', pagesData);

  // Тип для URL
  type URLItem = { loc: string };

  // Используем переменную окружения для базового URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const urls: URLItem[] = [];
  pagesData.forEach((page) => {
    const pageUrl = page.data?.url;
    if (pageUrl) {
      languages.forEach((lang) => {
        // Формируем URL с query-параметром ?lang=ru (или другой язык)
        const separator = pageUrl.includes('?') ? '&' : '?';
        const fullUrl = `${baseUrl}${pageUrl}${separator}lang=${lang}`;
        urls.push({ loc: fullUrl });
      });
    }
  });

  // Генерация XML с учетом alternate hreflang
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  urls.forEach((urlItem) => {
    xml += `  <url>\n`;
    xml += `    <loc>${urlItem.loc}</loc>\n`;

    // Формируем alternate-ссылки для всех языков
    languages.forEach((lang) => {
      // Здесь необходимо изменить логику формирования alternate URL, 
      // если используется query-параметр, можно повторно сформировать URL
      // с нужным lang.
      // Предположим, что оригинальный URL всегда имеет параметр lang в конце.
      const alternateUrl = urlItem.loc.replace(/lang=[a-z]{2}/, `lang=${lang}`);
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${alternateUrl}" />\n`;
    });
    xml += `  </url>\n`;
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
