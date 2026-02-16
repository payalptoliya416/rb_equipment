"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { SingleMachinery } from "@/types/apiType";

interface ProductSliderProps {
  data: SingleMachinery;
}

export default function ProductSlider({ data }: ProductSliderProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const media = data.images ?? [];

  // ✅ FILTER BY TYPE
  const photos = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  const activeMedia = activeTab === "photos" ? photos : videos;

  return (
    <>
      {/* ================= MAIN SLIDER ================= */}
      <div className="border border-light-gray  rounded-[15px] mb-[25px]">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {activeMedia.map((item) => (
            <SwiperSlide
              key={item.id}
              className="cursor-grab active:cursor-grabbing"
            >
                <div
        className="
          w-full
          max-w-[623px]
          mx-auto
         h-[220px]
        sm:h-[320px]
        md:h-[420px]
        lg:h-[500px]
          rounded-xl
          overflow-hidden
          flex items-center justify-center
        " >
              {/* IMAGE */}
                 {item.type === "image" && (
          <Image
            src={item.full_url}
            alt={data.name}
            fill
             sizes="(max-width: 768px) 100vw, 623px"
            priority
             className="w-full h-full object-cover rounded-[12px]"
          />
        )}

                {item.type === "video" && (
          <video
            src={item.full_url}
            controls
            className="w-full h-full object-contain"
          />
        )}
      </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex border rounded-xl overflow-hidden w-full border-light-gray mb-[25px]">
        <button
          onClick={() => setActiveTab("photos")}
          className={`w-1/2 py-2 sm:py-3 font-medium transition-all ${
            activeTab === "photos"
              ? "bg-green text-white"
              : "bg-white text-gray hover:bg-light-gray/20 hover:text-green"
          }`}
        >
          Photos
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`w-1/2 py-2 sm:py-3 font-medium transition-all ${
            activeTab === "videos"
              ? "bg-green text-white"
              : "bg-white text-gray hover:bg-light-gray/20 hover:text-green"
          }`}
        >
          Videos
        </button>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={6}
        spaceBetween={10}
        watchSlidesProgress
        className="mb-[30px]"
        breakpoints={{
          0: { slidesPerView: 2 },
          480: { slidesPerView: 4 },
          640: { slidesPerView: 5 },
          1024: { slidesPerView: 6 },
        }}
      >
        {activeMedia.map((item) => (
          <SwiperSlide key={item.id}>
           <div
          className="
            relative
            border border-light-gray
            w-[98px] h-[98px]
            2xl:w-[130px] 2xl:h-[130px]
            rounded-xl overflow-hidden
            cursor-pointer
          "
        >
          {item.type === "image" && (
            <Image
              src={item.full_url}
              alt="thumb"
              fill
              className="object-cover"
            />
          )}

          {item.type === "video" && (
            <video
              src={item.full_url}
              muted
              className="object-cover w-full h-full"
            />
          )}
        </div>

          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

