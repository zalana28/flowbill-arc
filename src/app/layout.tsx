import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/providers/web3-provider";
import { Header } from "@/components/header";
import { NetworkBanner } from "@/components/network-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowBill Arc — USDC Invoicing on Arc Testnet",
  description:
    "Create invoices, share payment links, and receive USDC payments on Arc Testnet. Built for freelancers and global builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Web3Provider>
          <Header />
          <NetworkBanner />
          <main className="flex flex-1 flex-col">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
