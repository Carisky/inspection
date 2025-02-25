import React from "react";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Box, Divider, Typography } from "@mui/material";
import pallete from "@/palette";

interface MultiLangTitleProps {
  translations?: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  showDividers?: boolean; // Включение/выключение Divider
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; // Выбор заголовка
}

const fontSizeMap: Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", number> = {
  h1: 40,
  h2: 34,
  h3: 28,
  h4: 22,
  h5: 16,
  h6: 12,
};

const MultiLangTitle: React.FC<MultiLangTitleProps> = ({
  translations = {},
  showDividers = true,
  headingLevel = "h2", // По умолчанию h2
}) => {
  const { locale } = useLocaleStore();

  const defaultTranslations = {
    ru: "Пример текста (RU)",
    en: "Example text (EN)",
    ua: "Приклад тексту (UA)",
    pl: "Przykładowy text (PL)",
  };

  const mergedTranslations = { ...defaultTranslations, ...translations };

  const text =
    mergedTranslations[locale as keyof typeof mergedTranslations] ||
    mergedTranslations.ru;

  return (
    <Box sx={{ width: "100%" }}>
      {showDividers && <Divider sx={{ backgroundColor: "#01aaa0" }} />}
      <Typography
        variant={headingLevel} // Динамический заголовок
        component={headingLevel}
        sx={{
          color: pallete.common_colors.main_color,
          textAlign: "center",
          fontSize: `${fontSizeMap[headingLevel]}px`, // Размер заголовка
          fontWeight: 600,
        }}
      >
        {text}
      </Typography>
      {showDividers && <Divider sx={{ backgroundColor: "#01aaa0" }} />}
    </Box>
  );
};

export default MultiLangTitle;
