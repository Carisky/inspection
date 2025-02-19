import React from "react";
import Carousel from "react-multi-carousel";
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
}: {
  images: { url: string }[];
  imageWidth?: string;
  imageHeight?: string;
}) => {
  return (
    <Carousel
      responsive={responsive}
      autoPlay
      infinite
      keyBoardControl
      containerClass="carousel-container"
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
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImagesCarousel;
