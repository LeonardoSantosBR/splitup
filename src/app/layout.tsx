import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "SplitUp",
  description: "Divida despesas com seu grupo de forma simples.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full w-full flex-col overflow-x-hidden">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
