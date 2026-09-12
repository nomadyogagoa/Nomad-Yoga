import { apiRequest } from "@/lib/api-client";

export type PublicMedia = { id: string; role: "THUMBNAIL" | "GALLERY"; sortOrder: number; mediaAsset: { url: string; altText?: string | null; resourceType?: string } };
export type ContentBlock = { type?: string; text?: string; items?: string[]; imageUrl?: string; alt?: string };
export type PublicBlogPost = { id: string; title: string; slug: string; excerpt?: string | null; body?: { blocks?: ContentBlock[] } | null; coverImageUrl?: string | null; videoUrl?: string | null; publishedAt?: string | null; category?: { name: string } | null; tags?: { blogTag: { name: string } }[]; media?: PublicMedia[] };
export type PublicCampaign = { id: string; slug: string; title?: string | null; subject: string; summary?: string | null; body?: { blocks?: ContentBlock[] } | null; videoUrl?: string | null; publishedAt?: string | null; media?: PublicMedia[] };
export type PageResult<T> = { items: T[]; pagination?: { total: number; totalPages: number } };

export const listPublishedPosts = () => apiRequest<PageResult<PublicBlogPost>>("/blog/posts?limit=50");
export const getPublishedPost = (slug: string) => apiRequest<PublicBlogPost>(`/blog/posts/${encodeURIComponent(slug)}`);
export const listPublishedCampaigns = () => apiRequest<PageResult<PublicCampaign>>("/newsletter/campaigns?limit=50");
export const getPublishedCampaign = (slug: string) => apiRequest<PublicCampaign>(`/newsletter/campaigns/${encodeURIComponent(slug)}`);
export const subscribeNewsletter = (email: string, firstName?: string) => apiRequest<{ accepted: boolean }>("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email, ...(firstName ? { firstName } : {}) }) });

export const fallbackContentImage = "/images/about/nomad-story.jpg";
export function thumbnail(media: PublicMedia[] | undefined, fallback = fallbackContentImage) {
  return media?.find((item) => item.role === "THUMBNAIL")?.mediaAsset.url ?? fallback;
}
export function gallery(media: PublicMedia[] | undefined) {
  return (media ?? []).filter((item) => item.role === "GALLERY").sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 5);
}
export function formatPublishedDate(value?: string | null) {
  return value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";
}
