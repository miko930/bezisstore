import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bezi's Store — በቀላሉ ይዘዙ",
  description: "ከቴሌግራም በቀጥታ ይግዙ። ምርቶችን ይመልከቱ፣ ትዕዛዝ ያስገቡ፣ በአዲስ አበባ ወደ በርዎ ይደርሳል።",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="am"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
