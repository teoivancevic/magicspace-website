import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Lato } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "magicspace -- by teo.",
  description: "Capture curiosity. Build taste.",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "magicspace -- by teo.",
    description: "Capture curiosity. Build taste.",
    images: [{ url: "/og-image.jpeg", width: 1200, height: 1200 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "magicspace -- by teo.",
    description: "Capture curiosity. Build taste.",
    images: ["/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${lato.variable} antialiased`}>{children}</body>
    </html>
  );
}
