import { SwiperSlide } from "swiper/react";
import AutoSwiper from "./AutoSwiper";
import MediaItem from "./MediaItem";

const RecommendSlide = ({ medias, mediaType }) => {
  return (
    <AutoSwiper>
      {medias.map((item, index) => (
        <SwiperSlide key={index}>
          <MediaItem media={item} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default RecommendSlide;
