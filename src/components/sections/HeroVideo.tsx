"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideoProps {
  poster: string;
  videoUrl: string;
}

const STORAGE_KEY = "hero_video_time";

export default function HeroVideo({ poster, videoUrl }: HeroVideoProps) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Tunda penambahan tag video ke DOM agar render halaman awal instan
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // KUNCI PERBAIKAN: Setel waktu HANYA SETELAH metadata video selesai dimuat oleh browser
  const handleLoadedMetadata = () => {
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
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    // Simpan posisi waktu secara presisi
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
      {/* 1. Poster Image: z-10 memastikan tidak ada kerdipan hitam sebelum video berputar */}
      <img
        src={poster}
        alt="Hero Banner"
        className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ease-out ${
          isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* 2. Video Element */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          webkit-playsinline="true"
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onPlaying={() => setIsVideoPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover pointer-events-none transform-gpu"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
