'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import { SessionProvider } from "next-auth/react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/lib/store";
import { HydrateUser } from "./HydrateUser";
import { Toaster } from "sonner";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className="antialiased bg-background">
  <Provider store={store}>
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <HydrateUser />
        <Navbar />

        <Toaster position="top-right" />

        {children}

        <Footer />
      </ThemeProvider>
    </SessionProvider>
  </Provider>
</body>
    </html>
  );
}