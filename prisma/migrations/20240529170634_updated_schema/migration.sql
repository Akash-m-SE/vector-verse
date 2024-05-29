/*
  Warnings:

  - Added the required column `pdfName` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "pdfName" TEXT NOT NULL;
