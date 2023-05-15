import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import styled from "styled-components";

// Styled component for the swiper container
const SwiperContainer = styled(Swiper)`
  /* width: 100%; */
  height: 100%;
  display: flex;
  justify-content: center;

`;

// Define the type for the slides
type Slide = React.ReactNode;

// Props for the Swiper component
interface SwiperProps {
  slides: Slide[];
}

// Reusable Swiper component
const SwiperComponent: React.FC<SwiperProps> = ({ slides }) => {
  const swiperParams = {
    // Specify Swiper parameters here (e.g., navigation, pagination)
    navigation: true,
    pagination: true,
    scrollbar: true,
    // onSwiper: (swiper : any) => console.log(swiper),
    // onSlideChange: () => console.log("slide change"),
    module: [Navigation, Pagination, Scrollbar, A11y],
    spaceBetween: 0,
    slidesPerView: 2,
	centeredSlides: true,
    onSwiper: (swiper: any) => console.log(swiper),
    onSlideChange: () => console.log("slide change"),
  };

  return (
    <SwiperContainer {...swiperParams} className="">
      <div className="slide">
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>{slide}</SwiperSlide>
        ))}
      </div>
    </SwiperContainer>
  );
};

export default SwiperComponent;
