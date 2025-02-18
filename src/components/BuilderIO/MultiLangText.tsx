import React from "react";
import { useLocale } from "@/context/LocaleContext";

interface MultiLangTextProps {
  translations?: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
}

const MultiLangText: React.FC<MultiLangTextProps> = ({ translations = {} }) => {
  const { locale } = useLocale();

  const defaultTranslations = {
    ru: "Пример текста (RU)",
    en: "Example text (EN)",
    ua: "Приклад тексту (UA)",
    pl: "Przykładowy текст (PL)",
  };

  const mergedTranslations = { ...defaultTranslations, ...translations };

  const text =
    mergedTranslations[locale as keyof typeof mergedTranslations] ||
    mergedTranslations.ru;

  return <span>{text}</span>;
};

export default MultiLangText;
