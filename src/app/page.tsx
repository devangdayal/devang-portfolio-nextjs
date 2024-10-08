"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the WaveSphere component with no SSR
const WaveSphere = dynamic(() => import("@/app/assets/SpaceScene"), {
  ssr: false,
});

export default function Home() {
  const [text, setText] = useState("");
  const fullText = "Welcome to Devang's Portfolio";
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 text-white p-4 overflow-hidden">
      <WaveSphere />

      <div className="max-w-4xl text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight backdrop-blur-sm py-4 px-6 rounded-lg bg-slate-900/30">
          <span className="inline-block">
            {text}
            <span className="inline-block w-[2px] h-8 md:h-12 bg-white ml-1 animate-[blink_1s_steps(1)_infinite]"></span>
          </span>
        </h1>

        <Link
          href="/home"
          className="mt-12 inline-block px-8 py-4 text-lg font-semibold
                     bg-blue-600/80 hover:bg-blue-700 active:bg-blue-800
                     rounded-full transition-all duration-300 ease-in-out
                     transform hover:scale-105 hover:shadow-lg backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
