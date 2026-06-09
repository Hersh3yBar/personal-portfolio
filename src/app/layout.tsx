import type { Metadata } from "next";
import { Inter, Playfair_Display, Mrs_Saint_Delafield } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const signature = Mrs_Saint_Delafield({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hrishi Mucherla · Portfolio",
  description:
    "Computer Science @ University of Miami. AI/ML research at MIT IDSS and UMiami. AI/ML intern at 3rd-i. Building Reciprocal in Dallas.",
  metadataBase: new URL("https://hrishimucherla.vercel.app"),
  openGraph: {
    title: "Hrishi Mucherla",
    description:
      "Computer Science @ University of Miami. AI/ML research at MIT IDSS and UMiami. AI/ML intern at 3rd-i. Building Reciprocal in Dallas.",
    url: "https://hrishimucherla.vercel.app",
    siteName: "Hrishi Mucherla",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hrishi Mucherla",
    description:
      "Computer Science @ University of Miami. AI/ML research at MIT IDSS and UMiami. AI/ML intern at 3rd-i. Building Reciprocal in Dallas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${signature.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* If you're reading this, you're exactly the kind of person I want to work with. mucherla.hrishi@gmail.com */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LenisProvider>{children}</LenisProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
