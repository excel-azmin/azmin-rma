import {
  Injectable,
  OnModuleInit,
  HttpService,
  Logger,
  Inject,
} from '@nestjs/common';
import * as Agenda from 'agenda';
import { of } from 'rxjs';
import { map, retryWhen, delay, take, concatMap } from 'rxjs/operators';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { CustomerService } from '../../entity/customer/customer.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  FRAPPE_API_GET_CUSTOMER_ENDPOINT,
  ERPNEXT_CUSTOMER_CREDIT_LIMIT_ENDPOINT,
} from '../../../constants/routes';
import {
  CONTENT_TYPE,
  APPLICATION_JSON_CONTENT_TYPE,
  ACCEPT,
} from '../../../constants/app-strings';
import {
  RESET_CREDIT_LIMIT_SUCCESS,
  RESET_CREDIT_LIMIT_ERROR,
} from '../../../constants/messages';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { Customer } from '../../entity/customer/customer.entity';
import { CronJob } from 'cron';

export const RESET_CUSTOMER_CREDIT_LIMIT = 'RESET_CUSTOMER_CREDIT_LIMIT';
@Injectable()
export class ResetCreditLimitService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_TOKEN)
    private readonly agenda: Agenda,
    private readonly settings: SettingsService,
    private readonly customer: CustomerService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly http: HttpService,
  ) {}

  onModuleInit() {
    this.defineAgendaJob();

    // every 15 minutes
    // for every second '* * * * * *';
    const FIFTEEN_MINUTES_CRON_STRING = '0 */15 * * * *';

    const cronJob = new CronJob(FIFTEEN_MINUTES_CRON_STRING, async () => {
      const now = new Date();
      const customers = await this.customer.find({
        baseCreditLimitAmount: { $exists: true },
        tempCreditLimitPeriod: { $lte: now },
      });
      for (const customer of customers) {
        this.agenda.now(RESET_CUSTOMER_CREDIT_LIMIT, { customer });
      }
    });
    cronJob.start();
  }

  defineAgendaJob() {
    this.agenda.define(
      RESET_CUSTOMER_CREDIT_LIMIT,
      { concurrency: 1 },
      async (job: Agenda.Job, done) => {
        const customerWithCredit = job.attrs.data.customer as Customer;
        of(customerWithCredit)
          .pipe(
            concatMap(customer => {
              return this.settings.find().pipe(
                concatMap(settings => {
                  return this.clientToken.getServiceAccountApiHeaders().pipe(
                    concatMap(headers => {
                      headers[CONTENT_TYPE] = APPLICATION_JSON_CONTENT_TYPE;
                      headers[ACCEPT] = APPLICATION_JSON_CONTENT_TYPE;
                      return this.http
                        .get(
                          settings.authServerURL +
                            FRAPPE_API_GET_CUSTOMER_ENDPOINT +
                            '/' +
                            customer.name,
                          { headers },
                        )
                        .pipe(
                          map(res => res.data),
                          concatMap(erpnextCustomer => {
                            const creditLimits: any[] =
                              erpnextCustomer.credit_limits || [];

                            for (const limit of creditLimits) {
                              if (limit.company === settings.defaultCompany) {
                                this.http
                                  .put(
                                    settings.authServerURL +
                                      ERPNEXT_CUSTOMER_CREDIT_LIMIT_ENDPOINT +
                                      '/' +
                                      limit.name,
                                    {
                                      credit_limit:
                                        customer.baseCreditLimitAmount,
                                    },
                                    { headers },
                                  )
                                  .subscribe({
                                    next: success => {},
                                    error: error => {},
                                  });
                              }
                            }

                            creditLimits.push({
                              credit_limit: customer.baseCreditLimitAmount,
                              company: settings.defaultCompany,
                            });
                            return this.http
                              .put(
                                settings.authServerURL +
                                  FRAPPE_API_GET_CUSTOMER_ENDPOINT +
                                  '/' +
                                  customer.name,
                                { credit_limits: creditLimits },
                                { headers },
                              )
                              .pipe(
                                map(data => {
                                  this.customer
                                    .updateOne(
                                      { uuid: customerWithCredit.uuid },
                                      { $unset: { tempCreditLimitPeriod: '' } },
                                    )
                                    .then(updated => {})
                                    .catch(error => {});
                                  return data;
                                }),
                              );
                          }),
                        );
                    }),
                  );
                }),
              );
            }),
            retryWhen(error => error.pipe(delay(1000), take(3))),
          )
          .toPromise()
          .then(success => {
            Logger.log(RESET_CREDIT_LIMIT_SUCCESS, this.constructor.name);
            done();
            job
              .remove()
              .then(removed => {})
              .catch(err => {});
          })
          .catch((error: Error) => {
            Logger.error(RESET_CREDIT_LIMIT_ERROR, this.constructor.name);
            done();
            job
              .remove()
              .then(removed => {})
              .catch(err => {});
          });
      },
    );
  }

  getPureError(error) {
    if (error && error.response) {
      error = error.response.data ? error.response.data : error.response;
    }

    try {
      return JSON.parse(
        JSON.stringify(error, (keys, value) => {
          if (value instanceof Error) {
            const err = {};

            Object.getOwnPropertyNames(value).forEach(key => {
              err[key] = value[key];
            });

            return err;
          }

          return value;
        }),
      );
    } catch {
      return error.data ? error.data : error;
    }
  }
}
