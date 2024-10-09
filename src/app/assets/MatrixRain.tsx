"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix character set (katakana + numbers + some special characters)
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789".split(
        ""
      );

    // Column configuration
    const fontSize = 24;
    const columns = Math.ceil(canvas.width / fontSize);

    // Drops configuration for each column
    const drops = Array(columns)
      .fill(0)
      .map(() => ({
        y: Math.random() * canvas.height * -1, // Start above viewport randomly
        speed: Math.random() * 2 + 1, // Random speed
        length: Math.floor(Math.random() * 20 + 5), // Random trail length
        chars: Array(30)
          .fill(0)
          .map(() => chars[Math.floor(Math.random() * chars.length)]), // Characters in this column
        lastUpdate: 0, // Last time characters were updated
        updateInterval: Math.random() * 50 + 50, // Random update interval for characters
      }));

    const draw = (timestamp: number) => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      // Update and draw each drop
      drops.forEach((drop, i) => {
        const x = i * fontSize;

        // Update characters periodically
        if (timestamp - drop.lastUpdate > drop.updateInterval) {
          drop.chars.push(chars[Math.floor(Math.random() * chars.length)]);
          if (drop.chars.length > drop.length) drop.chars.shift();
          drop.lastUpdate = timestamp;
        }

        // Draw characters in the trail
        drop.chars.forEach((char, charIndex) => {
          const y = drop.y - charIndex * fontSize;

          // Skip if outside viewport
          if (y < -fontSize || y > canvas.height) return;

          // Calculate brightness based on position in trail
          const alpha = 1 - charIndex / drop.length;

          // First character (brightest)
          if (charIndex === drop.chars.length - 1) {
            ctx.fillStyle = "#fff"; // White for leading character
          } else {
            // Trail characters (green with varying brightness)
            const brightness = Math.floor(alpha * 255);
            ctx.fillStyle = `rgba(0, ${brightness + 50}, 0, ${alpha})`;
          }

          ctx.fillText(char, x, y);
        });

        // Update drop position
        drop.y += drop.speed;

        // Reset drop when it goes off screen
        if (drop.y - drop.length * fontSize > canvas.height) {
          drop.y = -fontSize;
          drop.speed = Math.random() * 2 + 1; // Randomize speed on reset
          drop.length = Math.floor(Math.random() * 20 + 5); // Randomize length on reset
        }
      });

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 bg-emerald-100 -z-10" />
  );
}
