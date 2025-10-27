import type { Metadata } from "next";
import "./globals.css";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  title: "Native UI Primitives",
  description: "Cross-platform UI components that work everywhere. Build once with React Native, deploy to web, iOS, and Android with a unified API.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
