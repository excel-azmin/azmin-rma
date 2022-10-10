import {
  Injectable,
  HttpService,
  NotImplementedException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  CustomerWebhookDto,
  PaymentTemplateTermsInterface,
} from '../../entity/customer/customer-webhook-interface';
import { CustomerService } from '../../entity/customer/customer.service';
import { from, throwError, of } from 'rxjs';
import { switchMap, map, retry } from 'rxjs/operators';
import { CUSTOMER_ALREADY_EXISTS } from '../../../constants/app-strings';
import { Customer } from '../../entity/customer/customer.entity';
import { v4 as uuidv4 } from 'uuid';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { FRAPPE_API_GET_PAYMENT_TERM_TEMPLATE_ENDPOINT } from '../../../constants/routes';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

@Injectable()
export class CustomerWebhookAggregateService extends AggregateRoot {
  constructor(
    private readonly customerService: CustomerService,
    private readonly clientTokenManager: ClientTokenManagerService,
    private readonly http: HttpService,
    private readonly settingsService: SettingsService,
    private readonly errorLogService: ErrorLogService,
  ) {
    super();
  }

  customerCreated(customerWebhookPayload: CustomerWebhookDto) {
    return from(
      this.customerService.findOne({ name: customerWebhookPayload.name }),
    ).pipe(
      switchMap(customer => {
        if (customer) {
          return of({ message: CUSTOMER_ALREADY_EXISTS });
        }
        const provider = this.mapCustomer(customerWebhookPayload);
        if (customerWebhookPayload.payment_terms) {
          this.syncCustomerCreditDays(provider);
        }
        this.customerService
          .create(provider)
          .then(success => {})
          .catch(error => {});
        return of({});
      }),
    );
  }

  mapCustomer(customerPayload: CustomerWebhookDto) {
    const customer = new Customer();
    Object.assign(customer, customerPayload);
    customer.credit_limits ? null : (customer.credit_limits = []);
    customer.uuid = uuidv4();
    customer.isSynced = customerPayload.payment_terms ? true : false;
    return customer;
  }

  syncCustomerCreditDays(customer: Customer) {
    return this.settingsService
      .find()
      .pipe(
        switchMap(settings => {
          if (!settings.authServerURL) {
            return throwError(new NotImplementedException());
          }
          return this.clientTokenManager.getServiceAccountApiHeaders().pipe(
            switchMap(headers => {
              const url =
                settings.authServerURL +
                FRAPPE_API_GET_PAYMENT_TERM_TEMPLATE_ENDPOINT +
                customer.payment_terms;
              return this.http.get(url, { headers }).pipe(
                map(data => data.data.data),
                switchMap(
                  (response: {
                    template_name: string;
                    terms: PaymentTemplateTermsInterface[];
                  }) => {
                    const creditDays: number = this.mapCustomerCreditDays(
                      response.terms,
                    );
                    return this.customerService.updateOne(
                      { uuid: customer.uuid },
                      {
                        $set: {
                          credit_days: creditDays,
                          isSynced: true,
                        },
                      },
                    );
                  },
                ),
              );
            }),
            retry(3),
          );
        }),
      )
      .subscribe({
        next: success => {},
        error: err => {
          this.errorLogService.createErrorLog(err, 'Customer', 'webhook', {});
        },
      });
  }

  mapCustomerCreditDays(customerCredit: PaymentTemplateTermsInterface[]) {
    let credit_days: number;
    for (const eachCustomerCredit of customerCredit) {
      if (eachCustomerCredit.invoice_portion === 100) {
        credit_days = eachCustomerCredit.credit_days;
        break;
      }
    }
    return credit_days;
  }

  customerDeleted(customer: CustomerWebhookDto) {
    return from(this.customerService.deleteOne({ name: customer.name }));
  }

  customerUpdated(customerPayload: CustomerWebhookDto) {
    return from(
      this.customerService.findOne({ name: customerPayload.name }),
    ).pipe(
      switchMap(customer => {
        if (!customer) {
          this.customerCreated(customerPayload).subscribe({
            next: success => {},
            error: err => {},
          });
          return of();
        }
        customerPayload.isSynced = true;
        customer.payment_terms = customerPayload.payment_terms;
        customerPayload.payment_terms
          ? this.syncCustomerCreditDays(customer)
          : (customerPayload.credit_days = null);
        this.customerService
          .updateOne({ uuid: customer.uuid }, { $set: customerPayload })
          .then(success => {})
          .catch(err => {});
        return of();
      }),
    );
  }
}
