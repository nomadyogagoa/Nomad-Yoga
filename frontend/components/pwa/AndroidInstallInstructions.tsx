"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";

interface AndroidInstallInstructionsProps {
  isOpen: boolean;
  isChromeAndroid: boolean;
  onClose(): void;
}

export function AndroidInstallInstructions({
  isOpen,
  isChromeAndroid,
  onClose,
}: AndroidInstallInstructionsProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

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
    {
      icon: "menu" as const,
      title: isChromeAndroid ? "Open the Chrome menu" : "Open your browser menu",
      copy: isChromeAndroid ? "Tap the three-dot menu (⋮)." : "Open the menu for your current browser.",
    },
    {
      icon: "plus" as const,
      title: "Choose the install option",
      copy: "Tap “Install app” or “Add to Home screen”. The wording may vary.",
    },
    { icon: "check" as const, title: "Confirm", copy: "Follow the browser prompt to add Nomad Yoga." },
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
        aria-labelledby="android-install-title"
        aria-describedby="android-install-description"
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
          <img
            className="android-install-app-icon"
            src="/icons/icon-192x192.png"
            alt=""
            width="52"
            height="52"
          />
          <p className="eyebrow">Nomad Yoga for Android</p>
          <h2 id="android-install-title">Install Nomad Yoga</h2>
          <p id="android-install-description">
            Add Nomad Yoga to your Home Screen for quick access and a focused app experience.
          </p>
        </div>

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

        <p className="ios-install-reassurance">
          If neither option appears, this browser may not currently support installation.
        </p>
        <button className="button ios-install-confirm" type="button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
