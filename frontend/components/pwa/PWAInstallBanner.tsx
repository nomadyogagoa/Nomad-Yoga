"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AndroidInstallInstructions } from "@/components/pwa/AndroidInstallInstructions";
import { IOSInstallInstructions } from "@/components/pwa/IOSInstallInstructions";
import { usePWAInstallability } from "@/components/pwa/PWAInstallabilityProvider";
import { usePWAUpdate } from "@/components/pwa/ServiceWorkerRegistration";

const OBSOLETE_DISMISSAL_KEY = "nomad-yoga-install-dismissed-at";
const SHOW_DELAY_MS = 4500;
const EXCLUDED_ROUTES = [
  "/admin",
  "/dashboard",
  "/login",
  "/register",
  "/account",
  "/member",
  "/payment",
  "/payments",
  "/checkout",
] as const;

function isExcludedRoute(pathname: string) {
  return EXCLUDED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function PWAInstallBanner() {
  const pathname = usePathname();
  const { updateAvailable } = usePWAUpdate();
  const {
    isInstalled,
    isStandalone,
    canPromptInstall,
    isAndroid,
    isChromeAndroid,
    isMobile,
    needsManualIOSInstall,
    needsManualAndroidInstall,
    installationCompleted,
    isInstalling,
    requestInstall,
  } = usePWAInstallability();
  const [isVisible, setIsVisible] = useState(false);
  const [isIOSInstructionsOpen, setIsIOSInstructionsOpen] = useState(false);
  const [isAndroidInstructionsOpen, setIsAndroidInstructionsOpen] = useState(false);
  const [iosInstructionsSeen, setIOSInstructionsSeen] = useState(false);
  const [androidInstructionsSeen, setAndroidInstructionsSeen] = useState(false);
  const [dismissedForCurrentSession, setDismissedForCurrentSession] = useState(false);
  const routeSuppressed = isExcludedRoute(pathname);

  useEffect(() => {
    try {
      window.localStorage.removeItem(OBSOLETE_DISMISSAL_KEY);
    } catch {
      // Storage availability does not affect the in-memory dismissal.
    }
  }, []);

  useEffect(() => {
    setIsVisible(false);

    if (updateAvailable || routeSuppressed || isInstalled || isStandalone || installationCompleted) {
      setIsIOSInstructionsOpen(false);
      setIsAndroidInstructionsOpen(false);
      return;
    }

    const isEligible =
      (isAndroid || canPromptInstall || needsManualIOSInstall) &&
      !iosInstructionsSeen &&
      !androidInstructionsSeen &&
      !dismissedForCurrentSession;

    if (!isEligible) return;

    const timeout = window.setTimeout(() => setIsVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [
    canPromptInstall,
    androidInstructionsSeen,
    dismissedForCurrentSession,
    installationCompleted,
    isAndroid,
    iosInstructionsSeen,
    isInstalled,
    isStandalone,
    needsManualIOSInstall,
    pathname,
    routeSuppressed,
    updateAvailable,
  ]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.debug("[Nomad Yoga PWA] install promotion", {
      isAndroid,
      isMobile,
      isInstalled,
      isStandalone,
      canPromptInstall,
      needsManualAndroidInstall,
      installationCompleted,
      routeSuppressed,
      dismissedForCurrentSession,
      updateAvailable,
    });
  }, [
    canPromptInstall,
    dismissedForCurrentSession,
    installationCompleted,
    isAndroid,
    isInstalled,
    isMobile,
    isStandalone,
    needsManualAndroidInstall,
    routeSuppressed,
    updateAvailable,
  ]);

  useEffect(() => {
    if (!canPromptInstall || !isAndroidInstructionsOpen) return;
    setIsAndroidInstructionsOpen(false);
    setAndroidInstructionsSeen(false);
  }, [canPromptInstall, isAndroidInstructionsOpen]);

  const dismiss = () => {
    setIsVisible(false);
    setDismissedForCurrentSession(true);
  };

  const handleInstall = async () => {
    if (needsManualIOSInstall) {
      setIsVisible(false);
      setIOSInstructionsSeen(true);
      setIsIOSInstructionsOpen(true);
      return;
    }

    if (needsManualAndroidInstall) {
      setIsVisible(false);
      setAndroidInstructionsSeen(true);
      setIsAndroidInstructionsOpen(true);
      return;
    }

    if (!canPromptInstall) {
      setIsVisible(false);
      return;
    }

    const outcome = await requestInstall();
    if (outcome === "dismissed") dismiss();
    if (outcome === "unavailable") setIsVisible(false);
  };

  if (updateAvailable || (!isVisible && !isIOSInstructionsOpen && !isAndroidInstructionsOpen)) return null;

  return (
    <>
      {isVisible && (
        <aside className="pwa-install-layer" aria-labelledby="pwa-install-title">
          <div className="pwa-install-card">
            <div className="pwa-install-brand">
              <span className="pwa-install-mark" aria-hidden="true">✦</span>
              <span>Nomad Yoga</span>
            </div>

            <h2 id="pwa-install-title">Take Nomad Yoga with you</h2>
            <p>Install the app for quicker access to classes, schedules, bookings and your practice.</p>

            <div className="pwa-install-benefits" aria-label="App benefits">
              <span>Classes</span>
              <span>Bookings</span>
              <span>Progress</span>
              <span>Reminders</span>
            </div>

            <div className="pwa-install-actions">
              <button
                className="button pwa-install-primary"
                type="button"
                onClick={() => void handleInstall()}
                disabled={isInstalling}
                aria-label={isInstalling ? "Opening Nomad Yoga installation" : "Install Nomad Yoga"}
              >
                {isInstalling ? "Opening install..." : "Install App"}
              </button>
              <button className="pwa-install-dismiss" type="button" onClick={dismiss}>
                Not now
              </button>
            </div>

            <span className="pwa-install-status" aria-live="polite">
              {isInstalling ? "Opening the browser installation prompt." : ""}
            </span>
          </div>
        </aside>
      )}

      <IOSInstallInstructions
        isOpen={isIOSInstructionsOpen}
        onClose={() => setIsIOSInstructionsOpen(false)}
      />
      <AndroidInstallInstructions
        isOpen={isAndroidInstructionsOpen}
        isChromeAndroid={isChromeAndroid}
        onClose={() => setIsAndroidInstructionsOpen(false)}
      />
    </>
  );
}
