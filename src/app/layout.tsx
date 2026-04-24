import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Grapes HQ",
  description: "Personal command center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950">
        <TooltipProvider>
          <Header />
          <main className="p-6 max-w-[1400px] mx-auto">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
