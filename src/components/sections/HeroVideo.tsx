"use client";

import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";

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
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // 1. Cek apakah video sudah pernah di-cache dalam sesi ini
    const isCached = sessionStorage.getItem("autohigh_hero_cached");
    if (isCached === "true") {
      setIsVideoReady(true);
    }

    // 2. Play video otomatis
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleVideoLoaded = () => {
    setIsVideoReady(true);
    sessionStorage.setItem("autohigh_hero_cached", "true");
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden select-none">
      {/* Poster Image (Instan 0ms) */}
      <Image
        src={poster}
        alt="Hero Background"
        fill
        priority
        quality={85}
        sizes="100vw"
        className={`object-cover transform-gpu transition-opacity duration-700 ease-out ${
          isVideoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video Element (Direct Cache & Stream) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onTimeUpdate={handleTimeUpdate}
        className={`w-full h-full object-cover pointer-events-none transform-gpu will-change-transform translate-z-0 backface-hidden transition-opacity duration-700 ease-out ${
          isVideoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30 pointer-events-none" />
    </div>
  );
});

export default HeroVideo;
