"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideoProps {
  poster: string;
  videoUrl: string;
}

const STORAGE_KEY = "hero_video_time";

export default function HeroVideo({ poster, videoUrl }: HeroVideoProps) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Tunda render tag video sebentar agar loading awal instan
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const video = videoRef.current;
    if (!video) return;

    // Setel posisi detik terakhir yang tersimpan dari sessionStorage
    const savedTime = sessionStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      const time = parseFloat(savedTime);
      if (!isNaN(time) && time < 30) {
        video.currentTime = time;
      }
    }

    // Paksa browser mobile untuk autoplay secara aman
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoLoaded(true);
        })
        .catch(() => {
          // Jika mobile menolak autoplay (misal: Low Power Mode),
          // fallback tetap tampilkan poster agar tidak blank.
          console.warn("Autoplay ditolak oleh browser mobile.");
        });
    }
  }, [shouldLoadVideo]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    sessionStorage.setItem(STORAGE_KEY, currentTime.toString());

    // Loop maks 30 detik
    if (currentTime >= 30) {
      videoRef.current.currentTime = 0;
      sessionStorage.setItem(STORAGE_KEY, "0");
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      {/* 1. Poster Image (Selalu tampil di mobile sebagai fallback/background) */}
      <img
        src={poster}
        alt="Hero Banner"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. Video Element dengan Atribut Wajib Mobile */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          // Atribut khusus Safari iOS & Chrome Mobile
          webkit-playsinline="true"
          preload="metadata"
          onLoadedData={() => setIsVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
