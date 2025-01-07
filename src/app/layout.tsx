import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Viewport } from "next"
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "On Drive",
  description: "Manage your work movements",
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" href="/icon.png"/>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster  position="top-center" richColors />
        </body>
      </html>
  );
}