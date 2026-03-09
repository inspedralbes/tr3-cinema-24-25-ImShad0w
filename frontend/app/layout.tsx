import type { Metadata } from "next";
import Header from "@/components/sections/Header"
import "./globals.css";

export const metadata: Metadata = {
  title: "PassMaster the ticketing system of choice",
  description: "PassMaster is a ticketing system app, created for the sole purpose of making things simple and easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
