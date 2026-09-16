import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";
import { PWAInstallabilityProvider } from "@/components/pwa/PWAInstallabilityProvider";
import { PWAUpdateBanner } from "@/components/pwa/PWAUpdateBanner";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://nomad-yoga.vercel.app"),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
};

import { OrganicTexture } from "@/components/ui/OrganicTexture";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1118" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <OrganicTexture />
        <ServiceWorkerRegistration>
          <PWAInstallabilityProvider>
            <AuthProvider>
              {children}
              <PWAInstallBanner />
              <PWAUpdateBanner />
            </AuthProvider>
          </PWAInstallabilityProvider>
        </ServiceWorkerRegistration>
      </body>
    </html>
  );
}
