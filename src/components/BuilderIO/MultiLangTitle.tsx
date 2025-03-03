import React from "react";
import { useLocaleStore } from "@/store/useLocaleStore";
import { Box, Divider, Typography } from "@mui/material";
import pallete from "@/palette";
import { motion } from "framer-motion";

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
  headingLevel = "h2",
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

  // Варианты анимации: изначально заголовок смещён вверх и невидим, затем появляется
  const variants = {
    hidden: { opacity: 0, y: -20 },
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
      <Box sx={{ width: "100%" }}>
        {showDividers && <Divider sx={{ backgroundColor: "#01aaa0" }} />}
        <Typography
          variant={headingLevel}
          component={headingLevel}
          sx={{
            color: pallete.common_colors.main_color,
            textAlign: "center",
            fontSize: `${fontSizeMap[headingLevel]}px`,
            fontWeight: 600,
          }}
        >
          {text}
        </Typography>
        {showDividers && <Divider sx={{ backgroundColor: "#01aaa0" }} />}
      </Box>
    </motion.div>
  );
};

export default MultiLangTitle;
