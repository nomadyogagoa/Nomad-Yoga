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
  const hasStarted = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setValue(end);
      return;
    }

    let frameId = 0;

    const startCounting = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      const startedAt = performance.now();

      const update = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * easedProgress));

        if (progress < 1) frameId = requestAnimationFrame(update);
      };

      frameId = requestAnimationFrame(update);
    };

    if (!("IntersectionObserver" in window)) {
      startCounting();
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [duration, end]);

  return (
    <strong ref={elementRef} aria-label={`${end}${suffix}`}>
      {value}
      {suffix}
    </strong>
  );
}
