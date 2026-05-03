import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phalanx Media Hub",
  description: "Phalanx Media",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
