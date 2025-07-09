import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nicole Wert",
  description:
    "Portfolio website of Nicole Wert – Software Engineer, creative technologist, and problem solver. Explore projects, technical skills, and experience in web development, cloud, and GenAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
