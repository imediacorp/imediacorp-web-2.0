import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({ subsets: ['latin'], weight: '500' }); // Medium weight equivalent
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Logo from '@/components/Logo';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intermedia Communications Corp.",
  description: "imediacorp.com — Balancing Innovation: Diagnostics and Creativity for Tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefin.className} antialiased`}
      >
        <nav className="fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
          <Link href="/" aria-label="Intermedia Communications Home">
            <Logo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm hover:underline">About</Link>
            <Link href="/products" className="text-sm hover:underline">Products</Link>
            <Link href="/site-audit" className="text-sm hover:underline">Site Audit</Link>
            <Link href="#contact" className="text-sm hover:underline">Contact</Link>
            <Link href="/products" className="bg-[#D4AF37] text-white px-4 py-2 rounded">Get Started</Link>
          </div>
        </nav>
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
