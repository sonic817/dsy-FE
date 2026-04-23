import Image from "next/image";

const ACTIONS = [
  {
    href: "https://naver.me/FbVRh21s",
    iconSrc: "/icons/naver-map.png",
    ariaLabel: "다율숲 네이버 지도 열기",
  },
  {
    href: "https://www.instagram.com/dayulsoop?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    iconSrc: "/icons/instagram.png",
    ariaLabel: "다율숲 인스타그램 열기",
  },
];

export default function FloatingActions() {
  return (
    <div className="floating-actions">
      {ACTIONS.map((action) => (
        <div key={action.href} className="floating-action">
          <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={action.ariaLabel}
            className="floating-action-link"
          >
            <Image
              src={action.iconSrc}
              alt=""
              width={56}
              height={56}
              className="floating-action-img"
              priority={false}
            />
          </a>
        </div>
      ))}
    </div>
  );
}
