import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero">
      <Image
        src="/hero.jpg"
        alt="다율숲 대표 이미지"
        className="hero-bg"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay">
        <h2 className="hero-title">
          한눈에 펼쳐지는 다율숲,
          <br />
          모든 발걸음이 배움이 됩니다.
        </h2>
        <p className="hero-subtitle">실천으로 가꾸고 숲으로 회복하는 우리들의 생태 지도</p>
      </div>
    </section>
  );
}
