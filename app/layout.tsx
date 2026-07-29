import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samsar — cât dai · cât ceri · cât scoți",
  description:
    "Samsar evaluează mașini pentru revânzare: cât să dai, cât să ceri și ce profit poți scoate.",
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
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
