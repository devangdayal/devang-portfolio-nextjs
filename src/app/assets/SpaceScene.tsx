"use client";
import { useEffect, useRef } from "react";

interface SpaceObject {
  x: number;
  y: number;
  radius: number;
  color: string;
  orbit: number;
  speed: number;
  angle: number;
  moons?: SpaceObject[];
  hasRings?: boolean;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
  rotationSpeed: number;
  currentRotation: number;
}

export default function SpaceScene() {
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

    // Create solar system objects
    const sun: SpaceObject = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 60, // Larger sun
      color: "#FDB813",
      orbit: 0,
      speed: 0,
      angle: 0,
    };

    const planets: SpaceObject[] = [
      {
        radius: 15,
        color: "#A0522D",
        orbit: 150,
        speed: 0.015,
        angle: 0,
        x: 0,
        y: 0,
      },
      {
        radius: 25,
        color: "#87CEEB",
        orbit: 250,
        speed: 0.01,
        angle: Math.PI,
        x: 0,
        y: 0,
        moons: [
          {
            radius: 8,
            color: "#C0C0C0",
            orbit: 45,
            speed: 0.04,
            angle: 0,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        radius: 30,
        color: "#FF6B6B",
        orbit: 380,
        speed: 0.007,
        angle: Math.PI / 2,
        x: 0,
        y: 0,
        hasRings: true,
      },
      {
        radius: 20,
        color: "#FFD700",
        orbit: 500,
        speed: 0.005,
        angle: Math.PI / 4,
        x: 0,
        y: 0,
        moons: [
          {
            radius: 6,
            color: "#C0C0C0",
            orbit: 35,
            speed: 0.04,
            angle: 0,
            x: 0,
            y: 0,
          },
          {
            radius: 4,
            color: "#DEB887",
            orbit: 50,
            speed: 0.03,
            angle: Math.PI,
            x: 0,
            y: 0,
          },
        ],
      },
    ];

    // Create larger asteroids
    const asteroids: Asteroid[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 6 + 3, // Larger asteroids
      speed: Math.random() * 0.8 + 0.3,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      currentRotation: Math.random() * Math.PI * 2,
    }));

    // Create stars with different sizes and brightnesses
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.05 + 0.01,
    }));

    const drawStar = (star: (typeof stars)[0], time: number) => {
      const brightness =
        star.brightness * (0.7 + 0.3 * Math.sin(time * star.twinkleSpeed));
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSpaceObject = (
      obj: SpaceObject,
      parentX = canvas.width / 2,
      parentY = canvas.height / 2
    ) => {
      // Draw orbit
      if (obj.orbit > 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(parentX, parentY, obj.orbit, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Calculate position
      obj.x = parentX + Math.cos(obj.angle) * obj.orbit;
      obj.y = parentY + Math.sin(obj.angle) * obj.orbit;

      // Draw rings if the planet has them
      if (obj.hasRings) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(Math.PI / 4);
        ctx.scale(1, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, obj.radius * 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }

      // Draw planet
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fillStyle = obj.color;
      ctx.fill();

      // Add surface detail
      ctx.beginPath();
      ctx.arc(
        obj.x - obj.radius * 0.2,
        obj.y - obj.radius * 0.2,
        obj.radius * 0.8,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      ctx.fill();

      // Draw moons
      obj.moons?.forEach((moon) => {
        drawSpaceObject(moon, obj.x, obj.y);
        moon.angle += moon.speed;
      });
    };

    // Draw asteroid with surface detail
    const drawAsteroid = (asteroid: Asteroid) => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(asteroid.currentRotation);

      // Main asteroid body
      ctx.beginPath();
      ctx.moveTo(-asteroid.radius, 0);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * asteroid.radius * 0.4;
        const r = asteroid.radius + jitter;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = "#808080";
      ctx.fill();

      // Surface details
      ctx.beginPath();
      ctx.arc(
        -asteroid.radius * 0.3,
        -asteroid.radius * 0.3,
        asteroid.radius * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fill();

      ctx.restore();
    };

    let time = 0;
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.016;

      // Draw stars with twinkling
      stars.forEach((star) => drawStar(star, time));

      // Draw sun with corona effect
      const gradient = ctx.createRadialGradient(
        sun.x,
        sun.y,
        sun.radius,
        sun.x,
        sun.y,
        sun.radius * 1.5
      );
      gradient.addColorStop(0, sun.color);
      gradient.addColorStop(1, "rgba(253, 184, 19, 0)");

      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
      ctx.fillStyle = sun.color;
      ctx.fill();

      // Draw planets
      planets.forEach((planet) => {
        drawSpaceObject(planet);
        planet.angle += planet.speed;
      });

      // Update and draw asteroids
      asteroids.forEach((asteroid) => {
        asteroid.x += Math.cos(asteroid.angle) * asteroid.speed;
        asteroid.y += Math.sin(asteroid.angle) * asteroid.speed;
        asteroid.currentRotation += asteroid.rotationSpeed;

        // Wrap around screen
        if (asteroid.x < -asteroid.radius)
          asteroid.x = canvas.width + asteroid.radius;
        if (asteroid.x > canvas.width + asteroid.radius)
          asteroid.x = -asteroid.radius;
        if (asteroid.y < -asteroid.radius)
          asteroid.y = canvas.height + asteroid.radius;
        if (asteroid.y > canvas.height + asteroid.radius)
          asteroid.y = -asteroid.radius;

        drawAsteroid(asteroid);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 bg-[#0B0B2A] -z-10" />
  );
}
