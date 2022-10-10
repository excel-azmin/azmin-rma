import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopoverController } from '@ionic/angular';
import { CreditLimitDataSource } from './credit-limit-datasource';
import { SalesService } from '../sales-ui/services/sales.service';
import { UpdateCreditLimitComponent } from './update-credit-limit/update-credit-limit.component';
import { DEFAULT_COMPANY } from '../constants/storage';
import { StorageService } from '../api/storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidateInputSelected } from '../common/pipes/validators';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.page.html',
  styleUrls: ['./credit-limit.page.scss'],
})
export class CreditLimitPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: CreditLimitDataSource;
  displayedColumns = [
    'name',
    'customer_name',
    'credit_limits',
    'extended_credit_limit',
    'expiry_date',
    'set_by',
    'set_on',
  ];
  name: any;
  customer_name: any;
  search: any;
  filters: any = [];
  filteredCustomerList: Observable<any[]>;
  customerProfileForm: FormGroup;
  validateInput: any = ValidateInputSelected;

  get f() {
    return this.customerProfileForm.controls;
  }

  constructor(
    private readonly location: Location,
    private readonly salesService: SalesService,
    private readonly storage: StorageService,
    private readonly popoverController: PopoverController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.dataSource = new CreditLimitDataSource(this.salesService);
    this.dataSource.loadItems();
    this.filteredCustomerList = this.customerProfileForm
      .get('customer')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getCustomerList(value);
        }),
      );
  }

  createFormGroup() {
    this.customerProfileForm = new FormGroup({
      customer: new FormControl(),
    });
  }

  getCustomerOption(option) {
    if (option) {
      if (option.customer_name) {
        return `${option.customer_name}`;
      }
      return option.customer_name;
    }
  }

  clearFilters() {
    this.customer_name = '';
    this.name = '';
    this.f.customer.setValue('');
    this.dataSource.loadItems();
  }

  navigateBack() {
    this.location.back();
  }

  async updateCreditLimitDialog(row?) {
    const defaultCompany = await this.storage.getItem(DEFAULT_COMPANY);
    const creditLimits: { credit_limit: number; company: string }[] =
      row.credit_limits || [];
    let creditLimit = 0;

    for (const limit of creditLimits) {
      if (limit.company === defaultCompany) {
        creditLimit = limit.credit_limit;
      }
    }

    const popover = await this.popoverController.create({
      component: UpdateCreditLimitComponent,
      componentProps: {
        uuid: row.uuid,
        customer: row.name,
        baseCreditLimit: row.baseCreditLimitAmount || 0,
        currentCreditLimit: creditLimit,
        expiryDate: row.tempCreditLimitPeriod,
      },
    });
    popover.onDidDismiss().then(() => {
      this.dataSource.loadItems();
    });
    return await popover.present();
  }

  setFilter(customer?) {
    this.dataSource.loadItems(
      customer.name,
      this.sort.direction,
      customer?.pageIndex || 0,
      customer?.pageSize || 30,
    );
  }
}
