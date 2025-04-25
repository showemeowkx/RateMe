import { diskStorage } from 'multer';
import { editFileName, validateFileType } from './file.utils';

export const storageOptions = {
  storage: diskStorage({
    destination: './src/uploads/item-images',
    filename: editFileName,
  }),
  fileFilter: validateFileType,
  limits: { fileSize: 5 * 1024 * 1024 },
};
