"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MatrixRain = dynamic(() => import("@/app/assets/MatrixRain"), {
  ssr: false,
});

export default function Landing() {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-4 overflow-hidden">
      <MatrixRain />

      <div className="max-w-4xl text-center relative z-10 space-y-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight py-10 px-6 rounded-2xl backdrop-blur-2xl bg-black/20">
          <span className="inline-block">
            {text}
            <span className="inline-block w-[2px] h-8 md:h-12 bg-white ml-1 animate-[blink_1s_steps(1)_infinite]"></span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col items-center space-y-4">
          <Link
            href="/home" // This link will navigate to the Home page
            className="inline-block px-8 py-4 text-lg font-semibold
                       bg-green-600/80 hover:bg-green-700 active:bg-green-800
                       rounded-full transition-all duration-300 ease-in-out
                       transform hover:scale-105 hover:shadow-lg backdrop-blur-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Enter the Matrix
          </Link>
        </div>
      </div>
    </div>
  );
}
