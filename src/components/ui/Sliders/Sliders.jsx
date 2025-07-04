import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./IndicatorSlider.css";

import thumbnail1 from "../../../assets/images/img1.jpg";
import thumbnail2 from "../../../assets/images/img2.jpg";
import thumbnail3 from "../../../assets/images/img3.png";
import thumbnail4 from "../../../assets/images/img4.png";
import logo from "../../../assets/images/logo.svg";

const sliderData = [
  {
    image: thumbnail1,
    altText: "Rahat Sewa",
    title: <>Rahat Sewa: Build Better Communications With <br/> Peers & Businesses</>,
    description: <>Uttar Pradesh State Disaster Management Authority</>,
    paragraph: <>उत्तर प्रदेश राज्य आपदा प्रबंधन प्राधिकरण</>
  },
  {
    image: thumbnail2,
    altText: "Rahat Sewa",
    title: <>Rahat Sewa: Build Better Communications With <br/> Peers & Businesses</>,
    description: <>Uttar Pradesh State Disaster Management Authority</>,
    paragraph: <>उत्तर प्रदेश राज्य आपदा प्रबंधन प्राधिकरण</>
  },
  {
    image: thumbnail3,
    altText: "Rahat Sewa",
    title: <>Rahat Sewa: Build Better Communications With <br/> Peers & Businesses</>,
    description: <>Uttar Pradesh State Disaster Management Authority</>,
    paragraph: <>उत्तर प्रदेश राज्य आपदा प्रबंधन प्राधिकरण</>
  },
  {
    image: thumbnail4,
    altText: "Rahat Sewa",
    title: <>Rahat Sewa: Build Better Communications With <br/> Peers & Businesses</>,
    description: <>Uttar Pradesh State Disaster Management Authority</>,
    paragraph: <>उत्तर प्रदेश राज्य आपदा प्रबंधन प्राधिकरण</>
  },
];

const IndicatorSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear"
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {sliderData.map((slide, index) => (
          <div className="slider-img-div add-background" key={index}>
            <img
              className="slider-img opacity-90 object-cover w-full h-full"
              src={slide.image}
              alt={slide.altText}
            />

            <div className="setLogo">
              <img src={logo} alt="login logo" className="w-20" />
              <div className="mt-3 heading-600-26 c-white">{slide.title}</div>
            </div>

            <div className="image-title-para">
              <div className="heading-600-24 c-white">{slide.description}</div>

              <div className="heading-400-16 c-white">{slide.paragraph}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default IndicatorSlider;
