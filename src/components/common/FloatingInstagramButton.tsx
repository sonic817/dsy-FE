import Image from "next/image";

const INSTAGRAM_URL =
  "https://www.instagram.com/dayulsoop?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export default function FloatingInstagramButton() {
  return (
    <div className="floating-instagram-wrap">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="다율숲 인스타그램 열기"
        className="floating-instagram"
      >
        <Image
          src="/icons/instagram.png"
          alt=""
          width={56}
          height={56}
          className="floating-instagram-img"
          priority={false}
        />
      </a>
      <span className="floating-instagram-tooltip" aria-hidden="true">이동하기</span>
    </div>
  );
}
