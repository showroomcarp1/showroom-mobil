"use client";

import { memo, useRef } from "react";

interface HeroVideoProps {
  poster: string;
  webmSrc: string;
  mp4Src: string;
}

const HeroVideo = memo(function HeroVideo({
  poster,
  webmSrc,
  mp4Src,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // fungsi untuk reset video ke detik 0 jika mencapai detik 20
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 20) {
      videoRef.current.currentTime = 0;
      // pastikan video tetap berjalan secara seamless
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={poster}
      onTimeUpdate={handleTimeUpdate}
      /* GPU Acceleration & Layout Shift Protection */
      className="w-full h-full object-cover pointer-events-none transform-gpu will-change-transform translate-z-0 backface-hidden"
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

export default HeroVideo;