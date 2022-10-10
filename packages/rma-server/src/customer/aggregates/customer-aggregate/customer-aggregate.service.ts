import { Injectable, NotFoundException, HttpService } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CustomerAddedEvent } from '../../event/customer-added/customer-added.event';
import { CustomerService } from '../../entity/customer/customer.service';
import { CustomerDto } from '../../entity/customer/customer-dto';
import { CustomerRemovedEvent } from '../../event/customer-removed/customer-removed.event';
import { CustomerUpdatedEvent } from '../../event/customer-updated/customer-updated.event';
import { Customer } from '../../entity/customer/customer.entity';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import {
  FRAPPE_API_GET_USER_INFO_ENDPOINT,
  FRAPPE_API_GET_CUSTOMER_ENDPOINT,
} from '../../../constants/routes';

@Injectable()
export class CustomerAggregateService extends AggregateRoot {
  constructor(
    private readonly customerService: CustomerService,
    private readonly http: HttpService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly settings: SettingsService,
  ) {
    super();
  }

  addCustomer(customerPayload: CustomerDto, clientHttpRequest) {
    const customer = new Customer();
    customer.uuid = uuidv4();
    Object.assign(customer, customerPayload);
    this.apply(new CustomerAddedEvent(customer, clientHttpRequest));
  }

  async retrieveCustomer(params: unknown, req) {
    const customer = await this.customerService.findOne(params);
    if (!customer) throw new NotFoundException();
    return customer;
  }

  async getCustomerList(offset, limit, search, sort, clientHttpRequest) {
    if (sort !== 'ASC') {
      sort = 'DESC';
    }

    return await this.customerService.list(
      offset,
      limit,
      search,
      sort,
      clientHttpRequest.token.territory,
    );
  }

  async removeCustomer(uuid: string) {
    const customerFound = await this.customerService.findOne(uuid);
    if (!customerFound) {
      throw new NotFoundException();
    }
    this.apply(new CustomerRemovedEvent(customerFound));
  }

  async updateCustomer(updatePayload) {
    if (updatePayload.tempCreditLimitPeriod) {
      updatePayload.tempCreditLimitPeriod = new Date(
        updatePayload.tempCreditLimitPeriod,
      );
      updatePayload.tempCreditLimitPeriod.setDate(
        updatePayload.tempCreditLimitPeriod.getDate() + 1,
      );
    }

    const customer = await this.customerService.findOne({
      uuid: updatePayload.uuid,
    });

    if (!customer) {
      throw new NotFoundException();
    }
    const customerPayload = Object.assign(customer, updatePayload);
    this.apply(new CustomerUpdatedEvent(customerPayload));
  }

  getUserDetails(email: string) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        return this.http
          .get(
            settings.authServerURL + FRAPPE_API_GET_USER_INFO_ENDPOINT + email,
            { headers },
          )
          .pipe(map(res => res.data.data));
      }),
    );
  }

  relayListCustomers(query) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        const url = settings.authServerURL + FRAPPE_API_GET_CUSTOMER_ENDPOINT;
        return this.http
          .get(url, {
            headers,
            params: query,
          })
          .pipe(map(res => res.data));
      }),
    );
  }
  relayCustomer(name) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        const url = `${settings.authServerURL}${FRAPPE_API_GET_CUSTOMER_ENDPOINT}/${name}`;
        return this.http
          .get(url, {
            headers,
          })
          .pipe(map(res => res.data));
      }),
    );
  }
}
