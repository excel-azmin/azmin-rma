import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { of, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SettingsService } from '../../system-settings/aggregates/settings/settings.service';
import { ServerSettings } from '../../system-settings/entities/server-settings/server-settings.entity';

export const X_FRAPPE_API_KEY = 'x-frappe-api-key';

@Injectable()
export class FrappeWebhookGuard implements CanActivate {
  constructor(private readonly settingService: SettingsService) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    if (!req.headers[X_FRAPPE_API_KEY]) return of(false);
    return from(this.settingService.find()).pipe(
      switchMap((settings: ServerSettings) => {
        if (!settings.webhookApiKey) {
          return throwError(new NotImplementedException({ noAPIKeySet: true }));
        }

        if (
          settings.webhookApiKey &&
          settings.webhookApiKey === req.headers[X_FRAPPE_API_KEY]
        ) {
          return of(true);
        }

        return of(false);
      }),
    );
  }
}
