import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const FadeSlider = ({
  images = [],
  imageHeight = "auto",
}: {
  images: { url: string }[];
  imageWidth?: string;
  imageHeight?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
<Box sx={{ position: "relative", width: "100%", height:imageHeight }}>
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100vw",
      height: imageHeight,
      overflow: "hidden",
      zIndex: 1, // по необходимости
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
  {/* Другие компоненты внутри контейнера не будут залезать на слайдер */}
</Box>

  );
};

export default FadeSlider;
