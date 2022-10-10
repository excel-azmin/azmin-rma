import {
  Injectable,
  HttpService,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  INVALID_HTTP_METHOD,
  INVALID_REQUEST,
} from '../../../constants/messages';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { HttpRequestMethod } from '../../../constants/http-method.enum';
import {
  AUTHORIZATION,
  CONTENT_TYPE,
  ACCEPT,
} from '../../../constants/app-strings';

@Injectable()
export class CommandService {
  constructor(
    private readonly http: HttpService,
    private readonly settings: SettingsService,
  ) {}

  makeRequest(
    method: HttpRequestMethod,
    requestUrl: string[],
    params: unknown,
    data: unknown,
    headers: unknown,
  ) {
    if (!requestUrl) {
      return throwError(new BadRequestException(INVALID_REQUEST));
    }

    const relayHeaders = {};

    if (headers[AUTHORIZATION]) {
      relayHeaders[AUTHORIZATION] = headers[AUTHORIZATION];
    }

    if (headers[CONTENT_TYPE]) {
      relayHeaders[CONTENT_TYPE] = headers[CONTENT_TYPE];
    }

    if (headers[ACCEPT]) {
      relayHeaders[ACCEPT] = headers[ACCEPT];
    }

    return this.settings.find().pipe(
      switchMap(settings => {
        const url = settings.authServerURL + '/' + requestUrl[0];
        return this.relayCommand(method, url, params, data, relayHeaders);
      }),
      catchError(error => {
        let message = error.message;
        if (error.response && error.response.data) {
          message = error.response.data;
        }
        return throwError(new InternalServerErrorException(message));
      }),
    );
  }

  relayCommand(
    method: HttpRequestMethod,
    url: string,
    params: unknown,
    data: unknown,
    headers: unknown,
  ) {
    switch (method) {
      case HttpRequestMethod.GET:
        return this.http
          .get(url, {
            headers,
            params,
          })
          .pipe(map(res => res.data));

      case HttpRequestMethod.POST:
        return this.http
          .post(url, data, {
            headers,
            params,
          })
          .pipe(map(res => res.data));

      case HttpRequestMethod.PUT:
        return this.http
          .put(url, data, {
            headers,
            params,
          })
          .pipe(map(res => res.data));

      case HttpRequestMethod.PATCH:
        return this.http
          .patch(url, data, {
            headers,
            params,
          })
          .pipe(map(res => res.data));

      case HttpRequestMethod.DELETE:
        return this.http
          .delete(url, {
            headers,
            params,
          })
          .pipe(map(res => res.data));

      default:
        return throwError(new BadRequestException(INVALID_HTTP_METHOD));
    }
  }
}
