import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class StreamifyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');

    return next.handle().pipe(
      mergeMap((data: any[]) => {
        return new Observable<void>((subscriber) => {
          let index = 0;

          const sendNext = () => {
            if (index >= data.length) {
              res.end();
              subscriber.next();
              subscriber.complete();
              return;
            }

            const chunk = JSON.stringify(data[index]) + '\n';
            res.write(chunk);
            index++;

            setImmediate(sendNext);
          };

          sendNext();
        });
      }),
    );
  }
}
