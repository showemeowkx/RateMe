/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'rateme_uploads' },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
          else reject(new Error('Upload failed'));
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
