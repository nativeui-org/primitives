import type { Metadata } from "next";
import "./globals.css";
import { cn } from "../lib/utils";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Native UI Primitives",
  description: "Showcase of @native-ui-org/primitives using shadcn/ui styling",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}> 
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
