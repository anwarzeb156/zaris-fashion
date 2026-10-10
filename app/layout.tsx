import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zari's Fashion",
  description: "Handcrafted Abayas & Exclusive Perfume Brand",
  manifest: "/manifest.json",
  themeColor: "#be123c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zari's Fashion",
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}