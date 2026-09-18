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

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 20) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      onTimeUpdate={handleTimeUpdate}
      /* Hardware acceleration (GPU) & CSS optimizations */
      className="w-full h-full object-cover pointer-events-none transform-gpu will-change-transform translate-z-0 backface-hidden"
    >
      <source src={`${webmSrc}#t=0,20`} type="video/webm" />
      <source src={`${mp4Src}#t=0,20`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

export default HeroVideo;