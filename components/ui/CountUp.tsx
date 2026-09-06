"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  end: number;
  suffix?: string;
  duration?: number;
};

export function CountUp({ end, suffix = "", duration = 1600 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setValue(end);
      return;
    }

    let frameId: number | null = null;
    let hasStarted = false;

    const startCounting = () => {
      if (hasStarted) return;
      hasStarted = true;
      const startedAt = performance.now();

      const update = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * easedProgress));

        if (progress < 1) {
          frameId = requestAnimationFrame(update);
        } else {
          setValue(end);
        }
      };

      frameId = requestAnimationFrame(update);
    };

    if (!("IntersectionObserver" in window)) {
      startCounting();
      return () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [duration, end]);

  return (
    <strong ref={elementRef} aria-label={`${end}${suffix}`}>
      {value}
      {suffix}
    </strong>
  );
}
