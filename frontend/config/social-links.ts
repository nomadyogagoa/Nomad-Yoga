import type { IconName } from "@/components/ui/Icon";

export type SocialLink = {
  name: "LinkedIn" | "Instagram" | "Facebook" | "X" | "YouTube";
  href: string | null;
  icon: IconName;
};

// Add verified official URLs here when they are available.
export const socialLinks: readonly SocialLink[] = [
  { name: "LinkedIn", href: null, icon: "linkedin" },
  { name: "Instagram", href: null, icon: "instagram" },
  { name: "Facebook", href: null, icon: "facebook" },
  { name: "X", href: null, icon: "x" },
  { name: "YouTube", href: null, icon: "youtube" },
];
