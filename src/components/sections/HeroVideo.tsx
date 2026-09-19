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
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden select-none">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover pointer-events-none transform-gpu translate-z-0"
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30 pointer-events-none" />
    </div>
  );
});

export default HeroVideo;
