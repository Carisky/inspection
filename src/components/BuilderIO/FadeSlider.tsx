import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useLocaleStore } from "@/store/useLocaleStore"; // скорректируйте путь при необходимости

interface FadeSliderProps {
  images: { url: string }[];
  imageWidth?: string;
  imageHeight?: string;
  translationRu?: string;
  translationEn?: string;
  translationUa?: string;
  translationPl?: string;
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  fontSize?: number;
}

const FadeSlider: React.FC<FadeSliderProps> = ({
  images = [],
  imageHeight = "auto",
  translationRu = "Пример текста (RU)",
  translationEn = "Example text (EN)",
  translationUa = "Приклад тексту (UA)",
  translationPl = "Przykładowy текст (PL)",
  textColor = "#ffffff",
  textAlign = "center",
  fontSize = 20,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { locale } = useLocaleStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Объединяем переводы с возможными значениями по умолчанию
  const mergedTranslations = {
    ru: translationRu,
    en: translationEn,
    ua: translationUa,
    pl: translationPl,
  };

  const text =
    mergedTranslations[locale as keyof typeof mergedTranslations] ||
    mergedTranslations.ru;

  // Варианты анимации для текста
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: imageHeight }}>
      {/* Слайдер с изображениями */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: imageHeight,
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={img.url}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter:
                  "grayscale(30%) brightness(70%) contrast(80%) blur(0.3px)",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Оверлей с текстом */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: 0,
          width: "20%",
          zIndex: 2,
          pointerEvents: "none", // чтобы текст не блокировал клики по слайдеру
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: textAlign,
          color: textColor,
          p: 2,
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.75, ease: "easeOut" }}
          variants={variants}
        >
          <Typography variant="h4" sx={{ fontSize: `${fontSize}px` }}>
            {text}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default FadeSlider;
