import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo & Reminder App - Bootcamp",
  description: "Uji coba fungsionalitas CRUD dan Windows Notification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
