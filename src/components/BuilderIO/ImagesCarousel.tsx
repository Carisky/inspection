import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ImagesCarousel = ({
  images = [],
  imageWidth = "75%",
  imageHeight = "auto",
  aspectRatio = "",
}: {
  images: { url: string }[];
  imageWidth?: string;
  imageHeight?: string;
  aspectRatio?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage("");
  };

  return (
    <>
      <Carousel
        responsive={responsive}
        autoPlay
        infinite
        keyBoardControl
        containerClass="carousel-container"
        removeArrowOnDeviceType={["mobile"]}
      >
        {images.map((img, index) => (
          <div key={index} style={{ padding: "10px", textAlign: "center" }}>
            <img
              src={img.url}
              alt={`Slide ${index + 1}`}
              style={{
                width: imageWidth,
                height: imageHeight,
                borderRadius: "10px",
                objectFit: "cover",
                aspectRatio: aspectRatio,
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(img.url)}
            />
          </div>
        ))}
      </Carousel>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{ style: { overflow: "hidden" } }}
      >
        <DialogContent style={{ padding: 0, overflow: "hidden" }}>
          <img
            src={selectedImage}
            alt="Увеличенное изображение"
            style={{
              width: "100%",
              maxHeight: "90vh",
              objectFit: "cover",
              display: "block",
              // удалено height: "100%", чтобы не превышать размеры контейнера
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagesCarousel;
