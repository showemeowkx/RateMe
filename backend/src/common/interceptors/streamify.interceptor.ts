import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { tap } from 'rxjs/operators';

//TODO: Fix 'ERR_HTTP_HEADERS_SENT' error
@Injectable()
export class StreamifyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    res.header('Content-Type', 'application/x-ndjson');
    res.header('Transfer-Encoding', 'chunked');

    return next.handle().pipe(
      tap((data: any[]) => {
        res.write('[');
        data.forEach((item, index) => {
          if (index > 0) {
            res.write(',');
          }
          res.write(JSON.stringify(item) + '\n');
        });
        res.write(']');
        res.end();
      }),
    );
  }
}
