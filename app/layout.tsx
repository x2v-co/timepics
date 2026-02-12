import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";

// Orbitron for headings - futuristic, crypto-style
const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Exo 2 for body - modern, readable
const exo2 = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TimePics.ai - Render Any Moment",
  description: "AI-powered visual time machine. Generate images across past, parallel universes, and future timelines. Mint as Solana NFTs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${exo2.variable} antialiased bg-background text-foreground`}>
        <WalletContextProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
