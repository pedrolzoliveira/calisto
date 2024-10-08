-- RenameTable
ALTER TABLE "CategoryEmbedding" RENAME TO "category_embeddings";
ALTER TABLE "Source" RENAME TO "sources";
ALTER TABLE "News" RENAME TO "news";
ALTER TABLE "NewsEmbedding" RENAME TO "news_embeddings";
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Profile" RENAME TO "profiles";
ALTER TABLE "UserPassword" RENAME TO "user_passwords";
ALTER TABLE "ResetPasswordToken" RENAME TO "reset_password_tokens";
ALTER TABLE "Queue" RENAME TO "queues";

-- RenameColumn
ALTER TABLE "news" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "news_embeddings" RENAME COLUMN "newsSectionIndex" TO "news_section_index";
ALTER TABLE "queues" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "profiles" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "reset_password_tokens" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "reset_password_tokens" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "profiles" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "user_passwords" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "sources" RENAME COLUMN "avatarUrl" TO "avatar_url";
ALTER TABLE "news" RENAME COLUMN "sourceCode" TO "source_code";
ALTER TABLE "news" RENAME COLUMN "imageUrl" TO "image_url";

-- RenameIndex
ALTER INDEX "CategoryEmbedding_embedding_idx" RENAME TO "category_embeddings_embedding_idx";
ALTER INDEX "CategoryEmbedding_pkey" RENAME TO "category_embeddings_pkey";
ALTER INDEX "News_createdAt_idx" RENAME TO "news_created_at_idx";
ALTER INDEX "News_pkey" RENAME TO "news_pkey";
ALTER INDEX "NewsEmbedding_embedding_idx" RENAME TO "news_embeddings_embedding_idx";
ALTER INDEX "NewsEmbedding_pkey" RENAME TO "news_embeddings_pkey";
ALTER INDEX "Profile_pkey" RENAME TO "profiles_pkey";
ALTER INDEX "Profile_userId_name_key" RENAME TO "profiles_user_id_name_key";
ALTER INDEX "Queue_createdAt_idx" RENAME TO "queues_created_at_idx";
ALTER INDEX "Queue_key_idx" RENAME TO "queues_key_idx";
ALTER INDEX "Queue_pkey" RENAME TO "queues_pkey";
ALTER INDEX "ResetPasswordToken_pkey" RENAME TO "reset_password_tokens_pkey";
ALTER INDEX "Source_pkey" RENAME TO "sources_pkey";
ALTER INDEX "User_email_idx" RENAME TO "users_email_idx";
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
ALTER INDEX "User_pkey" RENAME TO "users_pkey";
ALTER INDEX "UserPassword_pkey" RENAME TO "user_passwords_pkey";

-- RenameType
ALTER TYPE "userRole" RENAME TO "user_role";

-- RenameForeignKey
ALTER TABLE "news" RENAME CONSTRAINT "News_sourceCode_fkey" TO "news_source_code_fkey";
ALTER TABLE "news_embeddings" RENAME CONSTRAINT "NewsEmbedding_link_fkey" TO "news_embeddings_link_fkey";
ALTER TABLE "profiles" RENAME CONSTRAINT "Profile_userId_fkey" TO "profiles_user_id_fkey";
ALTER TABLE "reset_password_tokens" RENAME CONSTRAINT "ResetPasswordToken_email_fkey" TO "reset_password_tokens_email_fkey";
ALTER TABLE "user_passwords" RENAME CONSTRAINT "UserPassword_userId_fkey" TO "user_passwords_user_id_fkey";

