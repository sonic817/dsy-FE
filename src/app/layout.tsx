import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual"` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
