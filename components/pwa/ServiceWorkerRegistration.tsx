"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const FOREGROUND_UPDATE_INTERVAL_MS = 60 * 60 * 1000;
const ACTIVATION_TIMEOUT_MS = 12 * 1000;

export interface PWAUpdateState {
  updateAvailable: boolean;
  isApplyingUpdate: boolean;
  updateError: string | null;
  applyUpdate(): void;
}

const PWAUpdateContext = createContext<PWAUpdateState | null>(null);

export function ServiceWorkerRegistration({ children }: Readonly<{ children: React.ReactNode }>) {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);
  const activationRequestedRef = useRef(false);
  const hasReloadedRef = useRef(false);
  const activationTimeoutRef = useRef<number | null>(null);
  const lastUpdateCheckRef = useRef(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const workerListeners: Array<{ worker: ServiceWorker; listener: () => void }> = [];

    const offerWaitingWorker = (worker: ServiceWorker | null) => {
      if (!worker || !navigator.serviceWorker.controller) return;
      waitingWorkerRef.current = worker;
      setUpdateAvailable(true);
      setUpdateError(null);
    };

    const monitorInstallingWorker = (worker: ServiceWorker | null) => {
      if (!worker) return;

      const handleStateChange = () => {
        if (worker.state === "installed") {
          offerWaitingWorker(registrationRef.current?.waiting ?? worker);
        }
      };

      worker.addEventListener("statechange", handleStateChange);
      workerListeners.push({ worker, listener: handleStateChange });
      handleStateChange();
    };

    const monitorRegistration = (registration: ServiceWorkerRegistration) => {
      registrationRef.current = registration;
      offerWaitingWorker(registration.waiting);
      monitorInstallingWorker(registration.installing);
      registration.onupdatefound = () => monitorInstallingWorker(registration.installing);
      lastUpdateCheckRef.current = Date.now();
    };

    const register = () => {
      void navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then(monitorRegistration)
        .catch((error: unknown) => {
          console.warn("Service worker registration failed:", error);
        });
    };

    const handleControllerChange = () => {
      waitingWorkerRef.current = null;
      setUpdateAvailable(false);

      if (!activationRequestedRef.current || hasReloadedRef.current) return;
      hasReloadedRef.current = true;
      if (activationTimeoutRef.current !== null) {
        window.clearTimeout(activationTimeoutRef.current);
        activationTimeoutRef.current = null;
      }
      window.location.reload();
    };

    const checkForUpdate = () => {
      if (
        document.visibilityState !== "visible" ||
        !registrationRef.current ||
        Date.now() - lastUpdateCheckRef.current < FOREGROUND_UPDATE_INTERVAL_MS
      ) {
        return;
      }

      lastUpdateCheckRef.current = Date.now();
      void registrationRef.current.update().catch(() => {
        // A future foreground event can try again without disrupting the current app.
      });
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    document.addEventListener("visibilitychange", checkForUpdate);

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      window.removeEventListener("load", register);
      document.removeEventListener("visibilitychange", checkForUpdate);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      workerListeners.forEach(({ worker, listener }) => worker.removeEventListener("statechange", listener));
      if (registrationRef.current) registrationRef.current.onupdatefound = null;
      if (activationTimeoutRef.current !== null) window.clearTimeout(activationTimeoutRef.current);
      registrationRef.current = null;
      waitingWorkerRef.current = null;
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (activationRequestedRef.current) return;

    const waitingWorker = waitingWorkerRef.current ?? registrationRef.current?.waiting ?? null;
    if (!waitingWorker) {
      setUpdateAvailable(false);
      setUpdateError("The update is not ready yet. Please try again later.");
      return;
    }

    activationRequestedRef.current = true;
    setIsApplyingUpdate(true);
    setUpdateError(null);

    try {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      activationTimeoutRef.current = window.setTimeout(() => {
        if (hasReloadedRef.current) return;
        activationRequestedRef.current = false;
        setIsApplyingUpdate(false);
        setUpdateError("The update could not be applied. Your current session is still safe.");
      }, ACTIVATION_TIMEOUT_MS);
    } catch {
      activationRequestedRef.current = false;
      setIsApplyingUpdate(false);
      setUpdateError("The update could not be applied. Your current session is still safe.");
    }
  }, []);

  const value = useMemo<PWAUpdateState>(
    () => ({ updateAvailable, isApplyingUpdate, updateError, applyUpdate }),
    [applyUpdate, isApplyingUpdate, updateAvailable, updateError]
  );

  return <PWAUpdateContext.Provider value={value}>{children}</PWAUpdateContext.Provider>;
}

export function usePWAUpdate() {
  const context = useContext(PWAUpdateContext);
  if (!context) throw new Error("usePWAUpdate must be used within ServiceWorkerRegistration");
  return context;
}
