import type { Metadata } from "next";
import Header from "@/components/sections/Header"
import "./globals.css";

export const metadata: Metadata = {
  title: "PassMaster",
  description: "Troba i reserva entrades per a esdeveniments en directe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className="bg-[#18181b] antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
