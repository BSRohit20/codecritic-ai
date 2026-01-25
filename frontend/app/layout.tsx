import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "CodeCritic AI - Intelligent Code Review",
  description: "Get instant AI-powered code reviews with detailed feedback, bug detection, and optimization tips using CodeCritic AI",
  keywords: ["code review", "AI", "code quality", "bug detection", "code analysis", "CodeCritic AI"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
