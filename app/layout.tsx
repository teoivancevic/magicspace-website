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
