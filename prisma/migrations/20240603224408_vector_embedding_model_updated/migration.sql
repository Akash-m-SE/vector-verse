/*
  Warnings:

  - The `embedding` column on the `VectorEmbedding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `chunkText` to the `VectorEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "VectorEmbedding" ADD COLUMN     "chunkText" TEXT NOT NULL,
DROP COLUMN "embedding",
ADD COLUMN     "embedding" vector(3);
