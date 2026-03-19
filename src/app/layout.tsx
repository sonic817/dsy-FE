import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sbAggroM = localFont({
  src: "../../public/fonts/sb-aggro-m.woff2",
  variable: "--font-body",
  display: "swap",
});

const sbAggroL = localFont({
  src: "../../public/fonts/sb-aggro-l.woff2",
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "다율숲 - 숲체험 예약",
  description: "다율숲 숲체험 프로그램 비회원 예약 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${sbAggroM.variable} ${sbAggroL.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual"` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
