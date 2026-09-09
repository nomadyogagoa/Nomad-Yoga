"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface IOSInstallInstructionsProps {
  isOpen: boolean;
  onClose(): void;
}

function detectIOSSafari() {
  const userAgent = navigator.userAgent;
  return (
    /Safari/i.test(userAgent) &&
    !/(CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser)/i.test(userAgent)
  );
}

export function IOSInstallInstructions({ isOpen, onClose }: IOSInstallInstructionsProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isSafari, setIsSafari] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsSafari(detectIOSSafari());
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackFocus = document.querySelector<HTMLElement>(".site-header a, main a, main button");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      } else {
        fallbackFocus?.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    { icon: "share" as const, title: "Tap Share", copy: "Tap the Share button in Safari." },
    { icon: "plus" as const, title: "Add to Home Screen", copy: "Scroll and choose “Add to Home Screen”." },
    { icon: "home" as const, title: "Confirm", copy: "Tap “Add” to install Nomad Yoga." },
  ];

  return (
    <div
      className="ios-install-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="ios-install-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
        aria-describedby="ios-install-description"
      >
        <button
          ref={closeButtonRef}
          className="ios-install-close"
          type="button"
          onClick={onClose}
          aria-label="Close installation instructions"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="ios-install-heading">
          <span className="pwa-install-mark" aria-hidden="true">✦</span>
          <p className="eyebrow">Nomad Yoga for iPhone &amp; iPad</p>
          <h2 id="ios-install-title">Add Nomad Yoga to your Home Screen</h2>
          <p id="ios-install-description">Keep your practice one tap away.</p>
        </div>

        {isSafari === false && (
          <p className="ios-install-browser-note">
            If Add to Home Screen isn&apos;t available here, open this page in Safari and follow these steps.
          </p>
        )}

        <ol className="ios-install-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="ios-install-number">{index + 1}</span>
              <span className="ios-install-icon"><Icon name={step.icon} size={21} /></span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="ios-install-reassurance">No App Store download required.</p>
        <button className="button ios-install-confirm" type="button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
