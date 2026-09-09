import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner";
import { PWAInstallabilityProvider } from "@/components/pwa/PWAInstallabilityProvider";
import { PWAUpdateBanner } from "@/components/pwa/PWAUpdateBanner";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

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
  themeColor: "#191919",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nomad-theme');if(t==='candlelight'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','candlelight');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <OrganicTexture />
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
