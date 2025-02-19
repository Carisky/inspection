import React from "react";
import { Box, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material";
import { useLocaleStore } from "@/stores/useLocaleStore";
import pallete from "@/palette";

interface IconTextItem {
  iconName: string;
  translations: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
}

interface IconTextListProps {
  items?: IconTextItem[];
}

const IconTextList: React.FC<IconTextListProps> = ({ items = [] }) => {
  const { locale } = useLocaleStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item, index) => {
        const IconComponent = (Icons as any)[item.iconName] || Icons.Info; // Если иконка не найдена, используем Info
        const text =
          item.translations[locale as keyof typeof item.translations] ||
          item.translations.ru ||
          "Текст не указан";

        return (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconComponent sx={{ fontSize: 24, color: pallete.common_colors.main_color }} />
            <Typography sx={{fontSize:"20px"}} variant="body1">{text}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default IconTextList;
