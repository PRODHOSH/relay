import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "flatpickr/dist/flatpickr.css";
import { Outfit } from "next/font/google";
import "simplebar-react/dist/simplebar.min.css";
import "swiper/css/bundle";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Relay - Drop-in HTML Email Templates",
  description: "Fully managed email rendering and queueing platform for teams of all industries.",
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const savedMode = localStorage.getItem('theme-mode');
              const legacySavedTheme = localStorage.getItem('theme');
              const initialMode = savedMode || legacySavedTheme || 'light';
              let resolved = initialMode;
              if (initialMode === 'auto') {
                resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              if (resolved === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-color-scheme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-color-scheme', 'light');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
