import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const setStorageOptions = (dir: string, allowedExtensions: string[]) => {
  return {
    storage: diskStorage({
      destination: `./src/uploads/${dir}`,
      filename: editFileName,
    }),
    fileFilter: validateFileType(allowedExtensions),
    limits: { fileSize: 5 * 1024 * 1024 },
  };
};

const editFileName = (
  req,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const originalFilename: string = path.parse(file.originalname).name;
  const storedFileName: string = originalFilename.replace(/\s/g, '') + uuidv4();
  const extension: string = path.parse(file.originalname).ext;

  cb(null, `${storedFileName}${extension}`);
};

const validateFileType = (allowedExtensions: string[]) => {
  return (
    req,
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
};
