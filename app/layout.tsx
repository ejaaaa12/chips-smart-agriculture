import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHIPS - Smart Agriculture System",
  description: "Dashboard petani & admin untuk prediksi harga dan hasil panen cabai berbasis AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="text-ink-900 antialiased">{children}</body>
    </html>
  );
}