import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Relay — Personalized PDF & Email Delivery at Scale",
  description: "Generate, personalize, and deliver LaTeX PDFs to any audience — automatically. Open-source email relay for teams.",
  keywords: ["LaTeX PDF", "email automation", "bulk PDF generation", "document delivery"],
  openGraph: {
    title: "Relay — Personalized PDF & Email Delivery at Scale",
    description: "Generate, personalize, and deliver LaTeX PDFs to any audience — automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fustat:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className} style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}>
        {children}
      </body>
    </html>
  );
}
