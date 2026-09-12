"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface DeferredInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: DeferredInstallPromptEvent;
    appinstalled: Event;
  }
}

interface NavigatorWithInstallContext extends Navigator {
  readonly standalone?: boolean;
  readonly userAgentData?: {
    readonly mobile: boolean;
    readonly platform?: string;
  };
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

export interface PWAInstallabilityState {
  isInstalled: boolean;
  isStandalone: boolean;
  canPromptInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isChromeAndroid: boolean;
  isMobile: boolean;
  isPhoneSized: boolean;
  needsManualIOSInstall: boolean;
  needsManualAndroidInstall: boolean;
  installationCompleted: boolean;
  isInstalling: boolean;
  lastInstallOutcome: InstallOutcome | null;
  requestInstall(): Promise<InstallOutcome>;
}

const PWAInstallabilityContext = createContext<PWAInstallabilityState | null>(null);

const DISPLAY_MODES = ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"] as const;

export function PWAInstallabilityProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const deferredPrompt = useRef<DeferredInstallPromptEvent | null>(null);
  const installRequest = useRef<Promise<InstallOutcome> | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPromptAvailable, setInstallPromptAvailable] = useState(false);
  const [installationCompleted, setInstallationCompleted] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [lastInstallOutcome, setLastInstallOutcome] = useState<InstallOutcome | null>(null);
  const [platform, setPlatform] = useState({
    isIOS: false,
    isAndroid: false,
    isChromeAndroid: false,
    isMobile: false,
    isPhoneSized: false,
  });

  useEffect(() => {
    const navigatorWithContext = navigator as NavigatorWithInstallContext;
    const displayModeQueries = DISPLAY_MODES.map((mode) =>
      window.matchMedia(`(display-mode: ${mode})`)
    );

    const updateStandaloneMode = () => {
      const matchesDisplayMode = displayModeQueries.some((query) => query.matches);
      const isIOSStandalone = navigatorWithContext.standalone === true;
      const isTrustedWebActivity = document.referrer.startsWith("android-app://");
      const standalone = matchesDisplayMode || isIOSStandalone || isTrustedWebActivity;

      setIsStandalone(standalone);
      if (standalone) {
        deferredPrompt.current = null;
        setInstallPromptAvailable(false);
      }
    };

    const userAgent = navigator.userAgent;
    const isIPadOS = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
    const isIOS = /iPad|iPhone|iPod/i.test(userAgent) || isIPadOS;
    const isAndroid = /Android/i.test(userAgent);
    const isChromeAndroid =
      isAndroid &&
      /Chrome\/\d+/i.test(userAgent) &&
      !/(?:EdgA|OPR|SamsungBrowser|UCBrowser|DuckDuckGo|YaBrowser)\//i.test(userAgent);
    const isMobile =
      navigatorWithContext.userAgentData?.mobile ??
      (isIOS || isAndroid || window.matchMedia("(pointer: coarse)").matches);

    const phoneViewport = window.matchMedia("(max-width: 768px)");
    const updatePhoneSized = () => {
      setPlatform((current) => ({ ...current, isPhoneSized: isMobile && phoneViewport.matches }));
    };

    setPlatform({ isIOS, isAndroid, isChromeAndroid, isMobile, isPhoneSized: isMobile && phoneViewport.matches });
    updateStandaloneMode();

    const handleBeforeInstallPrompt = (event: DeferredInstallPromptEvent) => {
      event.preventDefault();
      if (deferredPrompt.current || installRequest.current) return;

      deferredPrompt.current = event;
      setInstallPromptAvailable(true);
      setLastInstallOutcome(null);
    };

    const handleAppInstalled = () => {
      deferredPrompt.current = null;
      setInstallPromptAvailable(false);
      setInstallationCompleted(true);
      setLastInstallOutcome("accepted");
    };

    displayModeQueries.forEach((query) => query.addEventListener("change", updateStandaloneMode));
    phoneViewport.addEventListener("change", updatePhoneSized);
    window.addEventListener("resize", updatePhoneSized, { passive: true });
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      displayModeQueries.forEach((query) => query.removeEventListener("change", updateStandaloneMode));
      phoneViewport.removeEventListener("change", updatePhoneSized);
      window.removeEventListener("resize", updatePhoneSized);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      deferredPrompt.current = null;
    };
  }, []);

  const requestInstall = useCallback((): Promise<InstallOutcome> => {
    if (installRequest.current) return installRequest.current;

    const promptEvent = deferredPrompt.current;
    if (!promptEvent) {
      setInstallPromptAvailable(false);
      setLastInstallOutcome("unavailable");
      return Promise.resolve("unavailable");
    }

    deferredPrompt.current = null;
    setIsInstalling(true);
    setLastInstallOutcome(null);

    const pendingRequest = (async (): Promise<InstallOutcome> => {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        setLastInstallOutcome(choice.outcome);
        return choice.outcome;
      } catch {
        setLastInstallOutcome("unavailable");
        return "unavailable";
      } finally {
        setInstallPromptAvailable(false);
        setIsInstalling(false);
      }
    })();

    installRequest.current = pendingRequest;
    void pendingRequest.then(() => {
      if (installRequest.current === pendingRequest) installRequest.current = null;
    });
    return pendingRequest;
  }, []);

  const isInstalled = isStandalone || installationCompleted;
  const canPromptInstall = installPromptAvailable && !isInstalled && !platform.isIOS;
  const value = useMemo<PWAInstallabilityState>(
    () => ({
      isInstalled,
      isStandalone,
      canPromptInstall,
      isIOS: platform.isIOS,
      isAndroid: platform.isAndroid,
      isChromeAndroid: platform.isChromeAndroid,
      isMobile: platform.isMobile,
      isPhoneSized: platform.isPhoneSized,
      needsManualIOSInstall: platform.isIOS && !isInstalled,
      needsManualAndroidInstall:
        platform.isAndroid && !isInstalled && !canPromptInstall,
      installationCompleted,
      isInstalling,
      lastInstallOutcome,
      requestInstall,
    }),
    [
      canPromptInstall,
      installationCompleted,
      isInstalled,
      isInstalling,
      isStandalone,
      lastInstallOutcome,
      platform,
      requestInstall,
    ]
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.debug("[Nomad Yoga PWA] installability", {
      isAndroid: value.isAndroid,
      isMobile: value.isMobile,
      isInstalled: value.isInstalled,
      isStandalone: value.isStandalone,
      canPromptInstall: value.canPromptInstall,
      needsManualAndroidInstall: value.needsManualAndroidInstall,
      installationCompleted: value.installationCompleted,
    });
  }, [value]);

  return <PWAInstallabilityContext.Provider value={value}>{children}</PWAInstallabilityContext.Provider>;
}

export function usePWAInstallability() {
  const context = useContext(PWAInstallabilityContext);

  if (!context) {
    throw new Error("usePWAInstallability must be used within PWAInstallabilityProvider");
  }

  return context;
}
