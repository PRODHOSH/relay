import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://relay.prodhosh.me"),
  title: "Relay — Personalized PDF & Email Delivery at Scale",
  description: "Generate, personalize, and deliver LaTeX PDFs to any audience — automatically. Open-source email relay for teams.",
  keywords: ["LaTeX PDF", "email automation", "bulk PDF generation", "document delivery"],
  openGraph: {
    title: "Relay — Personalized PDF & Email Delivery at Scale",
    description: "Generate, personalize, and deliver LaTeX PDFs to any audience — automatically. Open-source, local document engine.",
    type: "website",
    url: "https://relay.prodhosh.me",
    siteName: "Relay",
    images: [
      {
        url: "/relay-icon.png",
        width: 800,
        height: 600,
        alt: "Relay Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Relay — Personalized PDF & Email Delivery",
    description: "Automate Document Workflows, Faster. Generate LaTeX PDFs from templates and CSV data.",
    creator: "@prodhosh",
    images: ["/relay-icon.png"],
  },
  icons: {
    icon: "/relay-icon.png",
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
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className} style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", background: "#09090b", color: "#fafafa" }}>
        {children}
      </body>
    </html>
  );
}
