
import type { Metadata } from 'next';
import { Poppins, Open_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context'; // Import ThemeProvider
import { ServiceWorkerRegistrar } from '@/components/core/service-worker-registrar';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'], 
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'HEX THE ADD HUB',
  description: 'The central hub for creators on the chain.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Let ThemeProvider handle class, suppressHydrationWarning for theme changes */}
      <head>
        {/* theme-color will be dynamically set by ThemeProvider if needed, or keep a default */}
        <meta name="theme-color" content="#FFB347" /> 
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HEX THE ADD HUB" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${poppins.variable} ${openSans.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <ThemeProvider> {/* Wrap AuthProvider and everything else with ThemeProvider */}
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            <ServiceWorkerRegistrar />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

    