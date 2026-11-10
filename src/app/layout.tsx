import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "SplitUp",
  description: "Divida despesas com seu grupo de forma simples.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
