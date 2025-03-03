import { Builder } from "@builder.io/react";
import Header from "./components/BuilderIO/Header";
import Footer from "./components/BuilderIO/Footer";
import ImagesCarousel from "./components/BuilderIO/ImagesCarousel";
import FadeSlider from "./components/BuilderIO/FadeSlider";
import ArticlePreview from "./components/BuilderIO/ArticlePreview";
import { ArticleGrid } from "./components/BuilderIO/ArticleGrid";
import MultiLangText from "./components/BuilderIO/MultiLangText"; // Импортируем MultiLangText
import MultiLangTitle from "./components/BuilderIO/MultiLangTitle";
import SocialMediaList from "./components/BuilderIO/SocialMediaList";
import IconTextList from "./components/BuilderIO/IconTextList";
import Kwiatkowska from "./components/BuilderIO/Contacts/Marketing/Kwiatkowska";
import PeopleAccordion from "./components/BuilderIO/PeopleAccordion";
import Krakowska from "./components/BuilderIO/Contacts/Marketing/Krakowska";
import CustomDivider from "./components/BuilderIO/Divider";

const materialIcons = [
  "Info",
  "CheckCircle",
  "Warning",
  "Error",
  "Star",
  "Favorite",
  "Home",
  "Phone",
  "Email",
  "Person",
  "ShoppingCart",
  "Help",
  "Check Circle",
];

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
        {
          name: "imageWidth",
          type: "string",
          defaultValue: "75%",
          helperText: "Ширина изображения (например: 300px, 100%)",
        },
        {
          name: "imageHeight",
          type: "string",
          defaultValue: "auto",
          helperText: "Высота изображения (например: 300px, auto)",
        },
        {
          name: "aspectRatio",
          type: "string",
          defaultValue: "",
          helperText: "Соотношение сторон изображения (например: 16/9, 4/3)",
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

    // Регистрация ArticlePreview с добавлением поля для изображения
    Builder.registerComponent(ArticlePreview, {
      name: "ArticlePreview",
      inputs: [
        {
          name: "title",
          type: "object",
          defaultValue: {
            ru: "Заголовок (RU)",
            en: "Title (EN)",
            ua: "Заголовок (UA)",
            pl: "Tytuł (PL)",
          },
          subFields: [
            { name: "ru", type: "string", defaultValue: "Заголовок (RU)" },
            { name: "en", type: "string", defaultValue: "Title (EN)" },
            { name: "ua", type: "string", defaultValue: "Заголовок (UA)" },
            { name: "pl", type: "string", defaultValue: "Tytuł (PL)" },
          ],
        },
        {
          name: "excerpt",
          type: "object",
          defaultValue: {
            ru: "Описание (RU)",
            en: "Excerpt (EN)",
            ua: "Опис (UA)",
            pl: "Opis (PL)",
          },
          subFields: [
            { name: "ru", type: "string", defaultValue: "Описание (RU)" },
            { name: "en", type: "string", defaultValue: "Excerpt (EN)" },
            { name: "ua", type: "string", defaultValue: "Опис (UA)" },
            { name: "pl", type: "string", defaultValue: "Opis (PL)" },
          ],
        },
        {
          name: "image",
          type: "file",
          allowedFileTypes: ["jpeg", "jpg", "png", "webp"],
          defaultValue: "https://via.placeholder.com/300",
          helperText: "Загрузите изображение для превью",
        },
        {
          name: "slug",
          type: "string",
          defaultValue: "slug",
        },
      ],
    });

    // Регистрация CustomDivider(разделитель)
    Builder.registerComponent(CustomDivider, {
      name: "Divider",
      canHaveChildren: false,
      inputs: [],
    });
    // Регистрация ArticleGrid (новый компонент)
    Builder.registerComponent(ArticleGrid, {
      name: "ArticleGrid",
      description: "Сетка превью статей с возможностью фильтрации по категории",
      inputs: [
        {
          name: "filterByCategory",
          type: "string",
          defaultValue: "",
          friendlyName: "Фильтр по категории (slug)",
          helperText:
            "Если указано, будут показаны только статьи, у которых slug категории совпадает с этим значением.",
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
            {
              name: "pl",
              type: "string",
              defaultValue: "Przykładowy текст (PL)",
            },
          ],
        },
        {
          name: "textAlign",
          type: "enum",
          defaultValue: "left",
          helperText: "Выравнивание текста",
          enum: ["left", "center", "right"],
        },
        {
          name: "fontSize",
          type: "number",
          defaultValue: 16,
          helperText: "Размер шрифта в px",
        },
      ],
    });

    // Регистрация MultiLangTitle (inline переводы)
    Builder.registerComponent(MultiLangTitle, {
      name: "MultiLangTitle",
      inputs: [
        {
          name: "translations",
          type: "object",
          subFields: [
            { name: "ru", type: "string", defaultValue: "Пример текста (RU)" },
            { name: "en", type: "string", defaultValue: "Example text (EN)" },
            { name: "ua", type: "string", defaultValue: "Приклад тексту (UA)" },
            {
              name: "pl",
              type: "string",
              defaultValue: "Przykładowy текст (PL)",
            },
          ],
        },
        {
          name: "showDividers",
          type: "boolean",
          defaultValue: true,
          helperText: "Показывать Divider перед и после заголовка",
        },
        {
          name: "headingLevel",
          type: "enum",
          defaultValue: "h2",
          helperText: "Выберите уровень заголовка (h1-h6)",
          enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
        },
      ],
    });

    // Регистрация SocialMediaList (Список соц сетей)
    Builder.registerComponent(SocialMediaList, {
      name: "SocialMediaList",
      description: "Список соцсетей с цветными иконками",
    });

    // Регистрация IconTextList (Список с иконками)
    Builder.registerComponent(IconTextList, {
      name: "IconTextList",
      description: "Список текста с иконками и мультиязычностью",
      inputs: [
        {
          name: "items",
          type: "list",
          defaultValue: [
            {
              iconName: "Info",
              translations: {
                ru: "Пример строки (RU)",
                en: "Example line (EN)",
                ua: "Приклад рядка (UA)",
                pl: "Przykładowa linia (PL)",
              },
            },
          ],
          subFields: [
            {
              name: "iconName",
              type: "enum",
              helperText: "Выберите иконку",
              enum: materialIcons,
              defaultValue: "Info",
            },
            {
              name: "translations",
              type: "object",
              subFields: [
                {
                  name: "ru",
                  type: "string",
                  defaultValue: "Пример строки (RU)",
                },
                {
                  name: "en",
                  type: "string",
                  defaultValue: "Example line (EN)",
                },
                {
                  name: "ua",
                  type: "string",
                  defaultValue: "Приклад рядка (UA)",
                },
                {
                  name: "pl",
                  type: "string",
                  defaultValue: "Przykładowa linia (PL)",
                },
              ],
            },
          ],
        },
      ],
    });

    // Регистрация Kwiatkowska (Список Контактов Wiktoria Kwiatkowska)
    Builder.registerComponent(Kwiatkowska, {
      name: "Kwiatkowska",
      description: "Список контактов Wiktoria Kwiatkowska",
      inputs: [
        {
          name: "contacts",
          type: "list",
          defaultValue: [
            "Wiktoria Kwiatkowska",
            "Kierownik Działu Marketingu",
            "kom. +48 608 675 834",
            "tel. +48 322 822 062",
            "w.kwiatkowska@tsl-silesia.com.pl",
          ],
          subFields: [
            { name: "text", type: "string", defaultValue: "Nowy kontakt" },
          ],
          helperText: "Добавьте или измените контакты",
        },
      ],
    });

    Builder.registerComponent(Krakowska, {
      name: "Krakowska",
      description: "Список контактов Daria Krakowska",
      inputs: [
        {
          name: "contacts",
          type: "list",
          defaultValue: [
            "Daria Żmurda - Krakowska",
            "Dyrektor ds. Handlu i Spedycji",
            "kom. +48 664 787 417",
            "tel. +48 32 282 90 62 wew. 20",
            "d.zmurda@tsl-silesia.com.pl",
          ],
          subFields: [
            { name: "text", type: "string", defaultValue: "Nowy kontakt" },
          ],
          helperText: "Добавьте или измените контакты",
        },
      ],
    });

    // Регистрация PeopleAccordion (Акордион с контактными данными)
    Builder.registerComponent(PeopleAccordion, {
      name: "PeopleAccordion",
      inputs: [
        {
          name: "headerTranslations",
          type: "object",
          subFields: [
            { name: "ru", type: "string", defaultValue: "Сотрудники" },
            { name: "en", type: "string", defaultValue: "Team Members" },
            { name: "ua", type: "string", defaultValue: "Співробітники" },
            { name: "pl", type: "string", defaultValue: "Pracownicy" },
          ],
          helperText: "Введите переводы для заголовка",
        },
        {
          name: "people",
          type: "list",
          defaultValue: [],
          subFields: [
            { name: "firstName", type: "string", defaultValue: "John" },
            { name: "lastName", type: "string", defaultValue: "Doe" },
            { name: "photo", type: "file" },
            {
              name: "positionTranslations",
              type: "object",
              subFields: [
                { name: "ru", type: "string", defaultValue: "Должность" },
                { name: "en", type: "string", defaultValue: "Position" },
                { name: "ua", type: "string", defaultValue: "Посада" },
                { name: "pl", type: "string", defaultValue: "Stanowisko" },
              ],
              helperText: "Введите переводы для должности",
            },
            {
              name: "tl",
              type: "string",
              defaultValue: "",
              helperText: "Введите номер телефона",
            },
            {
              name: "email",
              type: "string",
              defaultValue: "",
              helperText: "Введите email",
            },
            {
              name: "tlWew",
              type: "string",
              defaultValue: "",
              helperText: "Введите значение для tl.wew",
            },
          ],
        },
      ],
    });
  };
}

export default Register;
