import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay - Drop-in HTML Email Templates",
  description: "Fully managed email rendering and queueing platform for teams of all industries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link href="https://db.onlinewebfonts.com/c/04e6981992c0e2e7642af2074ebe3901?family=Helvetica+Now+Display+Bold" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
