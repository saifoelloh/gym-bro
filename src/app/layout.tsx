import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GYM TRACKER",
  description: "Track your lifts. Measure your gains.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-bg min-h-screen bg-bg text-text">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 pt-8 pb-20 sm:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
