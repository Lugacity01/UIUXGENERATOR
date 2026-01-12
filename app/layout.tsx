import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const appFont = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UIUX Generator App",
  description: "Generated High Quality UI/UX Designs with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={appFont.className}>
          
          <Provider>
             {children}
          </Provider>
          <Toaster position="top-center"/>
          </body>
      </html>
    </ClerkProvider>
  );
}
