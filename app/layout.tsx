import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KEYS Club | Karanavai East Youth Sports Club",
  description: "Book your badminton court easily at KEYS Club, Karanavai East.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", outfit.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans select-none">
        {process.env.NODE_ENV === "development" && (
          <>
            <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="beforeInteractive" />
            <Script id="eruda-init" strategy="afterInteractive">
              {`eruda.init();`}
            </Script>
          </>
        )}
        {children}
        <Toaster />
      </body>
    </html>
  );
}