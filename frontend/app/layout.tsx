import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeCritic AI - Intelligent Code Review",
  description: "Get instant AI-powered code reviews with detailed feedback, bug detection, and optimization tips using CodeCritic AI",
  keywords: ["code review", "AI", "code quality", "bug detection", "code analysis", "CodeCritic AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
