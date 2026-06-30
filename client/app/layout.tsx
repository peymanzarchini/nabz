import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import "./globals.css";
import { iransans } from "@/components/fonts/iransans";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "نبض",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa-IR"
      dir="rtl"
      suppressHydrationWarning
      className={`${iransans.variable} ${iransans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              richColors
              position="top-center"
              dir="rtl"
              closeButton
              className="font-iransans"
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
