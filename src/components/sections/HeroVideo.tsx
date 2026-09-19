"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideoProps {
  poster: string;
  videoUrl: string;
}

const STORAGE_KEY = "hero_video_time";
const PLAYING_KEY = "hero_video_was_playing";

export default function HeroVideo({ poster, videoUrl }: HeroVideoProps) {
  // 1. Cek cache secara sinkron saat komponen pertama kali dirender
  const [hasCache] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!sessionStorage.getItem(STORAGE_KEY);
  });

  // Jika sudah ada cache navigasi sebelumnya, langsung load video tanpa delay 300ms
  const [shouldLoadVideo, setShouldLoadVideo] = useState(hasCache);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!shouldLoadVideo) {
      // Hanya beri delay kecil jika ini benar-based "First Visit" aplikasi
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [shouldLoadVideo]);

  // Handler saat metadata video siap
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    // Restore detik video dari cache sessionStorage
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
    // Simpan detik video ke cache
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
      {/* 1. Poster Image (Instan tampil 0ms sebagai penutup layar hitam) */}
      <img
        src={poster}
        alt="Hero Banner"
        className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-300 ease-out ${
          isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* 2. Video Element dengan Instant Fallback Poster */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          webkit-playsinline="true"
          preload="auto"
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
