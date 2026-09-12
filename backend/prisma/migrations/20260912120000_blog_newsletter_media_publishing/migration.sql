-- Blog/newsletter media publishing foundation; all additions are nullable/default-safe.
CREATE TYPE "MediaProvider" AS ENUM ('LOCAL', 'CLOUDINARY');
CREATE TYPE "MediaResourceType" AS ENUM ('IMAGE', 'VIDEO', 'OTHER');
CREATE TYPE "ContentMediaRole" AS ENUM ('THUMBNAIL', 'GALLERY');
CREATE TYPE "NewsletterPublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "MediaAsset"
  ADD COLUMN "provider" "MediaProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN "resourceType" "MediaResourceType" NOT NULL DEFAULT 'IMAGE',
  ADD COLUMN "format" TEXT;

ALTER TABLE "BlogPost" ADD COLUMN "videoUrl" TEXT;

ALTER TABLE "NewsletterCampaign"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "title" TEXT,
  ADD COLUMN "summary" TEXT,
  ADD COLUMN "body" JSONB,
  ADD COLUMN "publicationStatus" "NewsletterPublicationStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "videoUrl" TEXT;

CREATE TABLE "ContentMedia" (
  "id" TEXT NOT NULL,
  "mediaAssetId" TEXT NOT NULL,
  "blogPostId" TEXT,
  "newsletterCampaignId" TEXT,
  "role" "ContentMediaRole" NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentMedia_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterCampaign_slug_key" ON "NewsletterCampaign"("slug");
CREATE UNIQUE INDEX "ContentMedia_blogPostId_mediaAssetId_key" ON "ContentMedia"("blogPostId", "mediaAssetId");
CREATE UNIQUE INDEX "ContentMedia_newsletterCampaignId_mediaAssetId_key" ON "ContentMedia"("newsletterCampaignId", "mediaAssetId");
CREATE INDEX "NewsletterCampaign_publicationStatus_publishedAt_idx" ON "NewsletterCampaign"("publicationStatus", "publishedAt");
CREATE INDEX "ContentMedia_blogPostId_role_sortOrder_idx" ON "ContentMedia"("blogPostId", "role", "sortOrder");
CREATE INDEX "ContentMedia_newsletterCampaignId_role_sortOrder_idx" ON "ContentMedia"("newsletterCampaignId", "role", "sortOrder");

ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_newsletterCampaignId_fkey" FOREIGN KEY ("newsletterCampaignId") REFERENCES "NewsletterCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentMedia" ADD CONSTRAINT "ContentMedia_exactly_one_owner_check" CHECK ((CASE WHEN "blogPostId" IS NOT NULL THEN 1 ELSE 0 END) + (CASE WHEN "newsletterCampaignId" IS NOT NULL THEN 1 ELSE 0 END) = 1);
