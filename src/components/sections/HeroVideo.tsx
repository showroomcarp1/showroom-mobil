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
    // Tunda pemuatan video sebentar agar render halaman awal instan
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Setel detik video ke posisi terakhir yang tersimpan saat video siap
  const handleLoadedData = () => {
    setIsVideoLoaded(true);

    if (videoRef.current) {
      const savedTime = sessionStorage.getItem(STORAGE_KEY);
      if (savedTime) {
        const time = parseFloat(savedTime);
        if (!isNaN(time) && time < 30) {
          videoRef.current.currentTime = time;
        }
      }
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;

    // Simpan posisi waktu terkini ke sessionStorage
    sessionStorage.setItem(STORAGE_KEY, currentTime.toString());

    // Fitur loop maks 30 detik
    if (currentTime >= 30) {
      videoRef.current.currentTime = 0;
      sessionStorage.setItem(STORAGE_KEY, "0");
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-hidden">
      {/* Poster Gambar */}
      <img
        src={poster}
        alt="Hero Banner"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Element Video */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
