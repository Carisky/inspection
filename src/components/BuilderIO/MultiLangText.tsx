import React from "react";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";

interface MultiLangTextProps {
  translations?: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  textAlign?: "left" | "center" | "right"; // Выбор выравнивания
  fontSize?: number; // Размер шрифта
}

const MultiLangText: React.FC<MultiLangTextProps> = ({
  translations = {},
  textAlign = "left",
  fontSize = 20,
}) => {
  const { locale } = useLocaleStore();

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

  // Варианты анимации: изначально текст смещён вниз и невидим, затем появляется
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      variants={variants}
    >
      <Typography
        variant="body1"
        sx={{
          textAlign,
          fontSize: `${fontSize}px`,
        }}
      >
        {text}
      </Typography>
    </motion.div>
  );
};

export default MultiLangText;
