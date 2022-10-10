import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  HttpService,
  BadRequestException,
} from '@nestjs/common';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { SettingsService } from '../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../aggregates/client-token-manager/client-token-manager.service';

@Injectable()
export class FrappeWebhookPipe implements CanActivate {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly clientTokenManager: ClientTokenManagerService,
    private readonly http: HttpService,
  ) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const body: { name: string; doctype: string } = this.getBody(req);
    if (!body) {
      return false;
    }
    return this.getFrappeDoc(body.name, body.doctype, req);
  }

  getFrappeDoc(docName, doctype, req) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException());
        }
        return this.clientTokenManager.getServiceAccountApiHeaders().pipe(
          switchMap(headers => {
            return this.http
              .get(
                settings.authServerURL + `/api/resource/${doctype}/${docName}`,
                { headers },
              )
              .pipe(
                map(data => data.data.data),
                switchMap((response: any) => {
                  req.body = response;
                  return of(true);
                }),
              );
          }),
        );
      }),
      catchError(err => {
        return throwError(new BadRequestException('Invalid Doc.'));
      }),
    );
  }

  getBody(request) {
    return request?.body?.name && request?.body?.doctype
      ? request?.body
      : undefined;
  }
}
