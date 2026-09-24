"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HeroVideoProps {
  poster: string;
  videoUrl: string;
}

const STORAGE_KEY = "hero_video_time";

export default function HeroVideo({ poster, videoUrl }: HeroVideoProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restore waktu playback dari sessionStorage secara aman di client-side
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = sessionStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      const time = parseFloat(savedTime);
      if (!isNaN(time) && time < 30 && time > 0) {
        video.currentTime = time;
      }
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn("Autoplay ditolak oleh browser mobile.");
      });
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    sessionStorage.setItem(STORAGE_KEY, currentTime.toString());

    // Loop maksimal 30 detik
    if (currentTime >= 30) {
      videoRef.current.currentTime = 0;
      sessionStorage.setItem(STORAGE_KEY, "0");
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      {/* 1. Poster Layer (z-10): Menggunakan Next/Image agar dimuat instant tanpa border/flash */}
      <div
        className={`absolute inset-0 z-10 w-full h-full bg-transparent transition-opacity duration-500 ease-out ${
          isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Image
          src={poster}
          alt="Hero Poster"
          fill
          priority
          sizes="100vw"
          className="object-cover border-none outline-none"
        />
      </div>

      {/* 2. Video Layer: Dikunci dengan bg-neutral-950 & atribut yang valid */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setIsVideoPlaying(true)}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover pointer-events-none border-none outline-none bg-neutral-950 transform-gpu"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
