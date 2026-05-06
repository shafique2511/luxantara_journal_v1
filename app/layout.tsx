import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxantara Journal",
  description: "Trading journal dashboard for Vercel and Supabase"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
