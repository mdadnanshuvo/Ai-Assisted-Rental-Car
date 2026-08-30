import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BestAuto — Car Rental & Admin Platform",
  description:
    "Fast, easy car rentals across the UK, with an AI vehicle recommendation assistant and a full admin dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
