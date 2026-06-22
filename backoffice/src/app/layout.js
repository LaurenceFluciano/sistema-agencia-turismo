import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}