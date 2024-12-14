import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatWeatherInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((weatherData) => {
        const { current } = weatherData || {};

        if (!current) {
          return {};
        }

        const {
          sunrise = null,
          sunset = null,
          temp = null,
          feels_like = null,
          pressure = null,
          humidity = null,
          uvi = null,
          wind_speed = null,
        } = current;

        return {
          sunrise,
          sunset,
          temp,
          feels_like,
          pressure,
          humidity,
          uvi,
          wind_speed,
        };
      }),
    );
  }
}
