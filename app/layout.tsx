import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdikt — afli pe loc dacă mașina merită",
  description:
    "Verdikt evaluează mașini pentru revânzare: cât să dai, cât să ceri și ce profit poți scoate.",
};

export const viewport: Viewport = {
  themeColor: "#eef2f7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
