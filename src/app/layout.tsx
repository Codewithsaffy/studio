import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { NextAuthProvider } from '@/components/NextAuthProvider';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { Header } from '@/components/grok/Header';
import { type CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'MehfilAI',
  description: 'Your smart wedding planning assistant with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider
              style={
                {
                  '--sidebar-width': '260px',
                  '--sidebar-width-icon': '80px',
                } as CSSProperties
              }
            >
              <LeftSidebar />
              <SidebarInset>
                <Header />
                {children}
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
