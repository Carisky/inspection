import { Builder } from "@builder.io/react";
import Header from "./components/BuilderIO/Header";
import Footer from "./components/BuilderIO/Footer";
import ImagesCarousel from "./components/BuilderIO/ImagesCarousel";
import FadeSlider from "./components/BuilderIO/FadeSlider";
import ArticlePreview from "./components/BuilderIO/ArticlePreview";
import MultiLangText from "./components/BuilderIO/MultiLangText"; // Импортируем MultiLangText

class Register {
  static init = () => {
    Builder.registerComponent(Header, {
      name: "Header",
    });

    Builder.registerComponent(Footer, {
      name: "Footer",
    });

    Builder.registerComponent(ImagesCarousel, {
      name: "ImagesCarousel",
      inputs: [
        {
          name: "images",
          type: "list",
          subFields: [
            {
              name: "url",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
              defaultValue: "https://via.placeholder.com/300",
            },
          ],
          defaultValue: [],
        },
      ],
    });

    // Регистрация FadeSlider
    Builder.registerComponent(FadeSlider, {
      name: "FadeSlider",
      inputs: [
        {
          name: "images",
          type: "list",
          subFields: [
            {
              name: "url",
              type: "file",
              allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
              defaultValue: "https://via.placeholder.com/300",
            },
          ],
          defaultValue: [],
        },
        {
          name: "imageWidth",
          type: "string",
          defaultValue: "100%",
          helperText: "Ширина слайдера (например: 300px, 100%)",
        },
        {
          name: "imageHeight",
          type: "string",
          defaultValue: "500px",
          helperText: "Высота слайдера (например: 300px, auto)",
        },
        {
          name: "textColor",
          type: "color",
          defaultValue: "#ffffff",
          helperText: "Цвет текста",
        },
      ],
    });

    // Регистрация ArticlePreview
    Builder.registerComponent(ArticlePreview, {
      name: "ArticlePreview",
      inputs: [
        {
          name: "title",
          type: "string",
          defaultValue: "Sample Title",
        },
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
          defaultValue: "https://via.placeholder.com/300",
        },
        {
          name: "excerpt",
          type: "string",
          defaultValue: "Sample excerpt...",
        },
        {
          name: "slug",
          type: "string",
          defaultValue: "sample-article",
        },
      ],
    });

    // Регистрация MultiLangText (inline переводы)
    Builder.registerComponent(MultiLangText, {
      name: "MultiLangText",
      inputs: [
        {
          name: "translations",
          type: "object",
          subFields: [
            { name: "ru", type: "string", defaultValue: "Пример текста (RU)" },
            { name: "en", type: "string", defaultValue: "Example text (EN)" },
            { name: "ua", type: "string", defaultValue: "Приклад тексту (UA)" },
            { name: "pl", type: "string", defaultValue: "Przykładowy tekst (PL)" },
          ],
        },
      ],
    });
  };
}

export default Register;
