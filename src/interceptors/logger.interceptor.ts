import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const body = req.body;
    console.log('REQUEST => ', { timestamp: new Date(), user, body })
    return next.handle().pipe(
      map(
        (response) => {
          console.log('RESPONSE => ', { timestamp: new Date(), response })
          return response;
        }
      )
    );
  }
}
