import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareBoard — Your Wellness Kanban",
  description: "A self-improving kanban board with your caring AI wellness companion, CareBot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
