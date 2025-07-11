import { Geist, Geist_Mono } from "next/font/google";
import "../public/assets/css/sp.css";
// import "../public/assets/css/common.css";
// import Header from "@/components/header";
import BodyWrapper from "@/components/BodyWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "えかどん",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <BodyWrapper>{children}</BodyWrapper>
      </body>
    </html>
  );
}
