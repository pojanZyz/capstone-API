-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Wisata', 'Budaya');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('1', '2', '3', '4', '5');

-- CreateEnum
CREATE TYPE "enum_rating_rating" AS ENUM ('1', '2', '3', '4', '5');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(5) NOT NULL DEFAULT 'user',
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT,
    "category" TEXT,
    "shortdesc" TEXT,
    "longdesc" TEXT,
    "location" TEXT,
    "image" TEXT,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" BIGSERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "ulasan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER NOT NULL,
    "articleid" BIGINT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
