"use client";

import dynamic from "next/dynamic";

const HeroVideo = dynamic(() => import("@/components/sections/HeroVideo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-950 animate-pulse flex items-center justify-center">
      <span className="text-neutral-700 text-xs font-mono uppercase tracking-widest">
        Loading Media...
      </span>
    </div>
  ),
});

export default HeroVideo;
