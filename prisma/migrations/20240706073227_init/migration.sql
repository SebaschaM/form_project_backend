/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[celular]` on the table `cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `cliente` MODIFY `edad` INTEGER NULL,
    MODIFY `direccion` VARCHAR(191) NULL,
    MODIFY `fecha_nacimiento` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cliente_correo_key` ON `cliente`(`correo`);

-- CreateIndex
CREATE UNIQUE INDEX `cliente_celular_key` ON `cliente`(`celular`);
