import React from "react";
import { Box, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material";
import { useLocaleStore } from "@/store/useLocaleStore";
import pallete from "@/palette";
import { motion } from "framer-motion";

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
        const IconComponent = (Icons as any)[item.iconName] || Icons.Info;
        const text =
          item.translations[locale as keyof typeof item.translations] ||
          item.translations.ru ||
          "Текст не указан";

        return (
          <motion.div
            key={index}
            initial={{ x: "-100%", opacity: 0 }}
            whileInView={{ x: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <IconComponent sx={{ fontSize: 24, color: pallete.common_colors.main_color }} />
              <Typography sx={{ fontSize: "20px" }} variant="body1">
                {text}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default IconTextList;
