import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SecurityProvider from "@/components/SecurityProvider";
import { Toaster } from "sonner";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const siteName = data.siteIdentity?.siteName || "Pasindu Jayasooriya";
  const siteRole = data.siteIdentity?.siteRole || "System & DevOps Engineer";

  return {
    title: `${siteName} | ${siteRole}`,
    description: data.profile.bio,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${jetbrainsMono.variable} ${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground min-h-screen selection:bg-white selection:text-black`}
      >
        <Providers>
          <SecurityProvider>
            {children}
            <Toaster
              position="top-right"
              theme="dark"
              closeButton
              toastOptions={{
                style: {
                  background: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px', // "optimized corners"
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Lightweight shadow
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                },
                className: 'cyber-toast'
              }}
            />
          </SecurityProvider>
        </Providers>
      </body>
    </html >
  );
}
