import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer, GlobalClickEffects, Header } from "@/components/layout";
import { MotionConfigProvider } from "@/components/motion";
import { getCurrentUser } from "@/lib/auth/current-user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabBridge",
  description:
    "고등학생의 연구 아이디어를 대전의 실제 연구실과 연구자가 검증하고 실현시켜주는 플랫폼",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionConfigProvider>
          <Header user={user} />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <GlobalClickEffects />
        </MotionConfigProvider>
      </body>
    </html>
  );
}
