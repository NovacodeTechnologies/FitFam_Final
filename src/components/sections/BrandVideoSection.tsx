'use client';

import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/Button';
// @ts-ignore
const brandVideo = "https://res.cloudinary.com/yn95hsyi/video/upload/q_auto/v1794299341/brand-video.mp4";

export const BrandVideoSection: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="bg-white py-0" id="brand-story">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[80vh]">

        {/* LEFT COLUMN — 40% */}
        <div className="lg:col-span-2 flex flex-col items-start justify-center px-10 sm:px-16 lg:px-20 py-16 gap-8">

          {/* Label */}
          <p className="font-chakra font-normal text-[10px] uppercase tracking-[0.4em] text-gray-400">
            Fitfam Active
          </p>

          {/* Title */}
          <h2 className="font-chakra font-normal text-3xl sm:text-4xl uppercase tracking-[0.15em] text-[#111111] leading-snug">
            Be Your Own Brand
          </h2>

          {/* Quote with gold left border */}
          <div className="border-l-2 border-[#D4AF37] pl-5">
            <p className="font-chakra font-normal text-[13px] tracking-[0.1em] text-gray-500 leading-relaxed">
              One day all this hard work will make sense for the best version of you.
            </p>
          </div>

          {/* CTA */}
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/category/all')}
          >
            Shop Now
          </Button>

        </div>

        {/* RIGHT COLUMN — 60% */}
        <div className="lg:col-span-3 relative overflow-hidden min-h-[400px] lg:min-h-full">

          {/* Left fade gradient blending into white */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onClick={togglePlay}
          >
            <source src={brandVideo} type="video/mp4" />
          </video>

          {/* Custom Play/Pause overlay */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-full border border-white bg-black/30 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              {isPlaying
                ? <Pause className="w-5 h-5 text-white" />
                : <Play className="w-5 h-5 text-white ml-1" />
              }
            </div>
          </button>

        </div>

      </div>
    </section>
  );
};