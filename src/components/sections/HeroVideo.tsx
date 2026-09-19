"use client";

import { memo, useRef, useEffect } from "react";

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

  // Lazy Playback via IntersectionObserver:
  // Video HANYA akan diputar ketika elemen masuk ke dalam layar (viewport).
  // Mencegah CPU/GPU bekerja keras saat user berada di area lain.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      // UBAH "auto" KE "metadata": Mencegah download file video raksasa sekaligus saat awal loading halaman
      preload="metadata"
      poster={poster}
      onTimeUpdate={handleTimeUpdate}
      // CSS Optimization: Menghapus utility class GPU berlebihan yang bisa memicu memory leak di mobile browser
      className="w-full h-full object-cover pointer-events-none transform-gpu"
    >
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
      Browser Anda tidak mendukung pemutaran video.
    </video>
  );
});

export default HeroVideo;
