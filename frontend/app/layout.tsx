import type { Metadata } from "next";
import Header from "@/components/sections/Header"
import "./globals.css";

export const metadata: Metadata = {
  title: "PassMaster",
  description: "Find and book tickets for live events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#18181b] antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
