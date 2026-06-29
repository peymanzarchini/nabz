import type { Metadata } from "next";
import "./globals.css";
import { iransans } from "@/components/fonts/iransans";

export const metadata: Metadata = {
  title: "نبض",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" className={`${iransans.variable} ${iransans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
