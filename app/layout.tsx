import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from "@/app/components/header";
import { SearchProvider } from "@/app/lib/SearchContext";

export const metadata: Metadata = {
  title: "BookIt - Experiences & Slots",
  description: "Book amazing travel experiences",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"w-full h-full flex flex-col" + " " + inter.className }>
        <SearchProvider>
          <Header />
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
