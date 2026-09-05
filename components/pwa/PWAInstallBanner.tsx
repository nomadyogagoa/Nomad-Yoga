"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IOSInstallInstructions } from "@/components/pwa/IOSInstallInstructions";
import { usePWAInstallability } from "@/components/pwa/PWAInstallabilityProvider";
import { usePWAUpdate } from "@/components/pwa/ServiceWorkerRegistration";

const DISMISSAL_KEY = "nomad-yoga-install-dismissed-at";
const DISMISSAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
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

function wasDismissedRecently() {
  try {
    const dismissedAt = Number(window.localStorage.getItem(DISMISSAL_KEY));
    return Number.isFinite(dismissedAt) && dismissedAt > 0 && Date.now() - dismissedAt < DISMISSAL_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function PWAInstallBanner() {
  const pathname = usePathname();
  const { updateAvailable } = usePWAUpdate();
  const {
    isInstalled,
    isStandalone,
    canPromptInstall,
    needsManualIOSInstall,
    installationCompleted,
    isInstalling,
    requestInstall,
  } = usePWAInstallability();
  const [isVisible, setIsVisible] = useState(false);
  const [isIOSInstructionsOpen, setIsIOSInstructionsOpen] = useState(false);
  const [iosInstructionsSeen, setIOSInstructionsSeen] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    if (updateAvailable || isExcludedRoute(pathname) || isInstalled || isStandalone || installationCompleted) {
      setIsIOSInstructionsOpen(false);
      return;
    }

    const isEligible =
      (canPromptInstall || needsManualIOSInstall) &&
      !iosInstructionsSeen &&
      !isExcludedRoute(pathname);

    if (!isEligible || wasDismissedRecently()) return;

    const timeout = window.setTimeout(() => setIsVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [
    canPromptInstall,
    installationCompleted,
    iosInstructionsSeen,
    isInstalled,
    isStandalone,
    needsManualIOSInstall,
    pathname,
    updateAvailable,
  ]);

  const dismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem(DISMISSAL_KEY, String(Date.now()));
    } catch {
      // The in-memory dismissal still applies when storage is unavailable.
    }
  };

  const handleInstall = async () => {
    if (needsManualIOSInstall) {
      setIsVisible(false);
      setIOSInstructionsSeen(true);
      setIsIOSInstructionsOpen(true);
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

  if (updateAvailable || (!isVisible && !isIOSInstructionsOpen)) return null;

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
    </>
  );
}
