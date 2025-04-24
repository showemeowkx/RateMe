import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storageOptions = {
  storage: diskStorage({
    destination: './src/uploads/item-images',
    filename: (req, file, cb) => {
      const originalFilename: string = path.parse(file.originalname).name;
      const storedFileName: string =
        originalFilename.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${storedFileName}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};
