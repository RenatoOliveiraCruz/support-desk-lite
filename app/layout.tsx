import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Desk Lite",
  description: "Mini sistema de chamados com Next.js, TypeScript e PostgreSQL"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
