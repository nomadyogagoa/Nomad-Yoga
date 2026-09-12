import { apiRequest } from "@/lib/api-client";

export type MediaAsset = { id: string; url: string; altText?: string | null; resourceType?: string; mimeType?: string; width?: number | null; height?: number | null };
export type BlogPost = { id: string; title: string; slug: string; excerpt?: string | null; body: Record<string, unknown>; coverImageUrl?: string | null; videoUrl?: string | null; status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; publishedAt?: string | null; updatedAt?: string; category?: { id: string; name: string } | null; tags?: { blogTag: { id: string; name: string } }[]; media?: { id: string; role: "THUMBNAIL" | "GALLERY"; sortOrder: number; mediaAsset: MediaAsset }[] };
export type PageResult<T> = { items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
export type BlogInput = { title: string; slug: string; excerpt?: string; body: Record<string, unknown>; coverImageUrl?: string; categoryId?: string | null; tagIds?: string[]; status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"; thumbnailMediaAssetId?: string; galleryMediaAssetIds?: string[]; videoUrl?: string };
export const listAdminPosts = (query = "") => apiRequest<PageResult<BlogPost>>(`/admin/blog/posts${query ? `?${query}` : ""}`);
export const getAdminPost = (id: string) => apiRequest<BlogPost>(`/admin/blog/posts/${id}`);
export const createAdminPost = (input: BlogInput) => apiRequest<BlogPost>("/admin/blog/posts", { method: "POST", body: JSON.stringify(input) });
export const updateAdminPost = (id: string, input: BlogInput) => apiRequest<BlogPost>(`/admin/blog/posts/${id}`, { method: "PATCH", body: JSON.stringify(input) });
export const archiveAdminPost = (id: string) => apiRequest<{ archived: boolean }>(`/admin/blog/posts/${id}`, { method: "DELETE" });
export const listBlogCategories = () => apiRequest<{ id: string; name: string; slug: string }[]>("/blog/categories");
export const listBlogTags = () => apiRequest<{ id: string; name: string; slug: string }[]>("/blog/tags");
export const listMediaAssets = () => apiRequest<PageResult<MediaAsset>>("/admin/media?pageSize=100");
export async function uploadBlogMedia(file: File, altText?: string) { const form = new FormData(); form.append("file", file); if (altText) form.append("altText", altText); form.append("context", "blog"); return apiRequest<MediaAsset>("/admin/media/upload", { method: "POST", body: form }); }
