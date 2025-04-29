import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const originalFilename: string = path.parse(file.originalname).name;
  const storedFileName: string = originalFilename.replace(/\s/g, '') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;

  cb(null, `${storedFileName}${extension}`);
};

export const validateFileType = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, valid: boolean) => void,
) => {
  const extension: string = path.parse(file.originalname).ext;
  if (allowedExtensions.includes(extension)) {
    return cb(null, true);
  }

  cb(
    new BadRequestException(
      `Invalid file type. Allowed extensions: ${allowedExtensions.toString()}`,
    ),
    false,
  );
};
