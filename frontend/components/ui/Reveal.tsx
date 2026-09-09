"use client";
import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;
  className?: string;
  [key: string]: unknown;
};

export function Reveal({ children, as = "div", delay = 0, className = "", ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
