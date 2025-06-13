/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { Response } from 'express';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestWithFile>();
    const response = ctx.getResponse<Response>();
    const excRes: any = exception.getResponse();

    const file = request.file;
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    response.status(400).json({
      statusCode: 400,
      message: excRes.message ? excRes.message : 'Validation error',
    });
  }
}
