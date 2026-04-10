"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HERO_IMAGES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];
const INTERVAL = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {HERO_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`다율숲 대표 이미지 ${i + 1}`}
          className={`hero-bg ${i === current ? "hero-bg-active" : ""}`}
          fill
          priority={i === 0}
          sizes="100vw"
        />
      ))}
      <div className="hero-overlay">
        <h2 className="hero-title">
          숲에서 배우고,
          <br />
          쉬며 성장하는 다율숲
        </h2>
      </div>
    </section>
  );
}
