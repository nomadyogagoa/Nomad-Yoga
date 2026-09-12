"use client";

import { useEffect, useState } from "react";
import { usePWAUpdate } from "@/components/pwa/ServiceWorkerRegistration";
import { usePWAInstallability } from "@/components/pwa/PWAInstallabilityProvider";

export function PWAUpdateBanner() {
  const { updateAvailable, isApplyingUpdate, updateError, applyUpdate } = usePWAUpdate();
  const { isPhoneSized } = usePWAInstallability();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!updateAvailable) setIsDismissed(false);
  }, [updateAvailable]);

  if (!isPhoneSized || !updateAvailable || isDismissed) return null;

  return (
    <aside
      className="pwa-update-layer"
      role="status"
      aria-live="polite"
      aria-labelledby="pwa-update-title"
      aria-describedby="pwa-update-description"
    >
      <div className="pwa-update-card">
        <div className="pwa-update-brand">
          <span className="pwa-install-mark" aria-hidden="true">✦</span>
          <span>Nomad Yoga</span>
        </div>
        <h2 id="pwa-update-title">Nomad Yoga has an update</h2>
        <p id="pwa-update-description">A newer version is ready.</p>

        <div className="pwa-update-actions">
          <button
            className="button pwa-update-primary"
            type="button"
            onClick={applyUpdate}
            disabled={isApplyingUpdate}
          >
            {isApplyingUpdate ? "Updating…" : "Update now"}
          </button>
          <button
            className="pwa-update-later"
            type="button"
            onClick={() => setIsDismissed(true)}
            disabled={isApplyingUpdate}
          >
            Later
          </button>
        </div>

        {updateError && <p className="pwa-update-error" role="alert">{updateError}</p>}
      </div>
    </aside>
  );
}
