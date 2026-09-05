import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";
import { PWAInstallabilityProvider } from "@/components/pwa/PWAInstallabilityProvider";
import { PWAUpdateBanner } from "@/components/pwa/PWAUpdateBanner";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: "#31402e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration>
          <PWAInstallabilityProvider>
            {children}
            <PWAInstallBanner />
            <PWAUpdateBanner />
          </PWAInstallabilityProvider>
        </ServiceWorkerRegistration>
      </body>
    </html>
  );
}
