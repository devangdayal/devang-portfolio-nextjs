import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Importing custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Setting the metadata for title and description
export const metadata: Metadata = {
  title: "Devang Dayal | SDE",
  description: "Devang's Portfolio Website based on Next.js 14.2",
  icons: {
    icon: {
      url: "/Title.svg",
      type: "image/svg+xml",
      sizes: "180*60",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
