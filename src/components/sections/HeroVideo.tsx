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

  // Jalankan play jika video sudah di-cache oleh browser
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoReady(true);
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Reset video ke detik 0 jika mencapai detik 30
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden select-none">
      {/* 1. Instant Poster Layer (Next.js Image Priority - 0ms Black Screen) */}
      <Image
        src={poster}
        alt="AutoHigh Hero Preview"
        fill
        priority
        quality={85}
        sizes="100vw"
        className={`object-cover transform-gpu transition-opacity duration-1000 ease-out ${
          isVideoReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. Seamless Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={() => {
          setIsVideoReady(true);
          videoRef.current?.play().catch(() => {});
        }}
        className={`w-full h-full object-cover pointer-events-none transform-gpu will-change-transform translate-z-0 backface-hidden transition-opacity duration-1000 ease-out ${
          isVideoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>

      {/* Overlay Gradient Halus ala Apple */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30 pointer-events-none" />
    </div>
  );
});

export default HeroVideo;
