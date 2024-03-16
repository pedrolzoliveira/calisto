-- Enable extension
CREATE EXTENSION vector;

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "Source" (
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "News" (
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sourceCode" VARCHAR(32) NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("link")
);

-- CreateTable
CREATE TABLE "NewsEmbedding" (
    "link" TEXT NOT NULL,
    "newsSectionIndex" INTEGER NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "NewsEmbedding_pkey" PRIMARY KEY ("link","newsSectionIndex")
);

-- CreateIndex
CREATE INDEX ON "NewsEmbedding" USING hnsw (embedding vector_cosine_ops);


-- CreateTable
CREATE TABLE "Profile" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "categories" VARCHAR(32)[],
    "userId" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryEmbedding" (
    "text" VARCHAR(32) NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "CategoryEmbedding_pkey" PRIMARY KEY ("text")
);

-- CreateIndex
CREATE INDEX ON "CategoryEmbedding" USING hnsw (embedding vector_cosine_ops);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "email" TEXT NOT NULL,
    "role" "userRole" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPassword" (
    "userId" VARCHAR(36) NOT NULL,
    "hash" VARCHAR(64) NOT NULL,

    CONSTRAINT "UserPassword_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_name_key" ON "Profile"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_sourceCode_fkey" FOREIGN KEY ("sourceCode") REFERENCES "Source"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsEmbedding" ADD CONSTRAINT "NewsEmbedding_link_fkey" FOREIGN KEY ("link") REFERENCES "News"("link") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
