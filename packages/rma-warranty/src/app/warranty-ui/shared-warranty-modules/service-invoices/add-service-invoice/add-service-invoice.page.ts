import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TimeService } from '../../../../api/time/time.service';
import {
  WarrantyItem,
  WarrantyClaimsDetails,
} from '../../../../common/interfaces/warranty.interface';
import { AddServiceInvoiceService } from './add-service-invoice.service';
import { Observable } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceInvoiceDetails } from './service-invoice-interface';
import {
  DURATION,
  CLOSE,
  SERVICE_INVOICE_STATUS,
  UPDATE_ERROR,
} from '../../../../constants/app-string';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingController } from '@ionic/angular';
import { ItemsDataSource } from '../items-datasource';
import {
  CONTACT_ENDPOINT,
  CUSTOMER_ENDPOINT,
  RELAY_LIST_ACCOUNT_ENDPOINT,
  RELAY_LIST_ADDRESS_ENDPOINT,
} from '../../../../constants/url-strings';
import { PERMISSION_STATE } from '../../../../constants/permission-roles';

@Component({
  selector: 'app-add-service-invoice',
  templateUrl: './add-service-invoice.page.html',
  styleUrls: ['./add-service-invoice.page.scss'],
})
export class AddServiceInvoicePage implements OnInit {
  dataSource: ItemsDataSource;
  customerCode: string;
  displayedColumns: string[] = [
    'item_group',
    'item_name',
    'quantity',
    'rate',
    'total',
    'delete',
  ];
  filteredCustomerList: Observable<any[]>;
  customerContactList: Observable<any[]>;
  territoryList: Observable<any[]>;
  warrantyDetails: WarrantyClaimsDetails;
  accountList: Observable<any[]>;
  addressList: Observable<any[]>;
  permissionState = PERMISSION_STATE;
  serviceInvoiceForm = new FormGroup({
    customer_name: new FormControl('', [Validators.required]),
    customer_contact: new FormControl(''),
    customer_address: new FormControl(''),
    account: new FormControl('', [Validators.required]),
    posting_date: new FormControl('', [Validators.required]),
    branch: new FormControl('', [Validators.required]),
    items: new FormArray([], this.itemValidator),
    total: new FormControl(0),
    is_pos: new FormControl(''),
  });
  itemsControl = this.serviceInvoiceForm.get('items') as FormArray;

  get f() {
    return this.serviceInvoiceForm.controls;
  }
  async getCurrentDate() {
    const date = new Date();
    const DateTime = await this.time.getDateAndTime(date);
    return DateTime.date;
  }
  constructor(
    private readonly location: Location,
    private readonly time: TimeService,
    private readonly serviceInvoiceService: AddServiceInvoiceService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly loadingController: LoadingController,
  ) {}

  async ngOnInit() {
    this.getCurrentDate();
    this.dataSource = new ItemsDataSource();
    this.serviceInvoiceForm.controls.is_pos.setValue(true);
    this.serviceInvoiceForm.controls.posting_date.setValue(
      await this.getCurrentDate(),
    );

    this.serviceInvoiceService
      .getStorage()
      .getItem('territory')
      .then(territory => {
        this.territoryList = territory;
      });

    this.accountList = this.serviceInvoiceForm
      .get('account')
      .valueChanges.pipe(
        startWith(''),
        this.serviceInvoiceService.getRelayList(RELAY_LIST_ACCOUNT_ENDPOINT),
      );

    this.serviceInvoiceService.getCashAccount().subscribe({
      next: response => {
        this.serviceInvoiceForm.controls.account.setValue(response[0]);
      },
    });

    this.addressList = this.serviceInvoiceForm
      .get('customer_address')
      .valueChanges.pipe(
        startWith(''),
        this.serviceInvoiceService.getRelayList(RELAY_LIST_ADDRESS_ENDPOINT),
      );

    this.filteredCustomerList = this.serviceInvoiceForm
      .get('customer_name')
      .valueChanges.pipe(
        startWith(''),
        this.serviceInvoiceService.getRelayList(
          CUSTOMER_ENDPOINT,
          'customer_name',
        ),
      );

    this.customerContactList = this.serviceInvoiceForm
      .get('customer_contact')
      .valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        this.serviceInvoiceService.getRelayList(CONTACT_ENDPOINT),
      );

    this.serviceInvoiceService
      .getWarrantyDetail(this.activatedRoute.snapshot.params.uuid)
      .subscribe({
        next: (res: WarrantyClaimsDetails) => {
          this.serviceInvoiceForm.controls.customer_name.setValue({
            name: res.customer,
          });
          this.serviceInvoiceForm.controls.customer_contact.setValue(
            res.customer_contact,
          );
          this.serviceInvoiceForm.controls.customer_address.setValue({
            name: res.customer_address,
          });
          this.serviceInvoiceForm.controls.branch.setValue(
            res.receiving_branch,
          );
          this.warrantyDetails = res;
        },
        error: err => {},
      });
  }

  navigateBack() {
    this.location.back();
  }

  async selectedPostingDate($event) {
    this.serviceInvoiceForm.controls.posting_date.setValue(
      await (await this.time.getDateAndTime($event.value)).date,
    );
  }

  async createInvoice() {
    const isValid = this.serviceInvoiceService.validateItemList(
      this.dataSource.data().map(item => item.item_code),
    );
    if (isValid) {
      const serviceInvoiceDetails = this.mapInvoiceData();
      const loading = await this.loadingController.create();
      await loading.present();
      this.serviceInvoiceService
        .createServiceInvoice(serviceInvoiceDetails)
        .subscribe({
          next: () => {
            loading.dismiss();
            this.router.navigate([
              '/warranty/view-warranty-claims',
              this.activatedRoute.snapshot.params.uuid,
            ]);
          },
          error: err => {
            loading.dismiss();
            if (!err?.error?.message) err.error.message = UPDATE_ERROR;
            this.snackbar.open(err.error.message, 'Close', {
              duration: DURATION,
            });
          },
        });
    } else {
      this.snackbar.open('Error : Duplicate Items added.', CLOSE, {
        duration: DURATION,
      });
    }
  }

  mapInvoiceData() {
    const serviceInvoiceDetails = {} as ServiceInvoiceDetails;
    serviceInvoiceDetails.warrantyClaimUuid = this.activatedRoute.snapshot.params.uuid;
    serviceInvoiceDetails.customer = this.customerCode;
    serviceInvoiceDetails.customer_contact = this.serviceInvoiceForm.controls.customer_contact.value.name;
    serviceInvoiceDetails.total_qty = 0;
    serviceInvoiceDetails.total = 0;
    serviceInvoiceDetails.due_date = this.serviceInvoiceForm.controls.posting_date.value;
    serviceInvoiceDetails.remarks = this.warrantyDetails.remarks;
    serviceInvoiceDetails.date = this.serviceInvoiceForm.controls.posting_date.value;
    serviceInvoiceDetails.customer_third_party = this.warrantyDetails.claim_type;
    serviceInvoiceDetails.branch = this.serviceInvoiceForm.controls.branch.value.name;
    serviceInvoiceDetails.posting_date = this.serviceInvoiceForm.controls.posting_date.value;
    serviceInvoiceDetails.customer_name = this.serviceInvoiceForm.controls.customer_name.value.name;
    serviceInvoiceDetails.customer_address = this.serviceInvoiceForm.controls.customer_address.value.name;
    serviceInvoiceDetails.claim_no = this.warrantyDetails.claim_no;
    serviceInvoiceDetails.docstatus = 1;
    serviceInvoiceDetails.outstanding_amount = 0;
    serviceInvoiceDetails.set_posting_time = 1;
    const itemList = this.dataSource.data().filter(item => {
      if (item.item_name !== '') {
        item.amount = item.qty * item.rate;
        serviceInvoiceDetails.total_qty += item.qty;
        serviceInvoiceDetails.total += item.amount;
        return item;
      }
    });
    serviceInvoiceDetails.items = itemList;
    if (this.serviceInvoiceForm.controls.is_pos.value) {
      serviceInvoiceDetails.is_pos = 1;
      this.serviceInvoiceService
        .getStorage()
        .getItem('pos_profile')
        .then(profile => {
          serviceInvoiceDetails.pos_profile = profile;
        });
      serviceInvoiceDetails.payments = [];
      serviceInvoiceDetails.status = SERVICE_INVOICE_STATUS.PAID;
      serviceInvoiceDetails.payments.push({
        account: this.serviceInvoiceForm.controls.account.value.name,
        mode_of_payment: 'Cash',
        amount: serviceInvoiceDetails.total,
      });
      return serviceInvoiceDetails;
    }
    serviceInvoiceDetails.is_pos = 0;
    serviceInvoiceDetails.status = SERVICE_INVOICE_STATUS.UNPAID;
    return serviceInvoiceDetails;
  }

  addItem() {
    const data = this.dataSource.data();
    const item = {} as WarrantyItem;
    item.item_code = '';
    item.item_name = '';
    item.qty = 0;
    item.rate = 0;
    item.minimumPrice = 0;
    data.push(item);
    this.itemsControl.push(new FormControl(item));
    this.dataSource.update(data);
  }

  updateItem(row: WarrantyItem, index: number, item: WarrantyItem) {
    if (item == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    Object.assign(row, item);
    row.item_group = item.item_group;
    row.qty = 1;
    row.rate = item.rate;
    this.calculateTotal(this.dataSource.data().slice());
    this.dataSource.update(copy);
    this.itemsControl.controls[index].setValue(item);
  }

  updateQuantity(row: WarrantyItem, quantity: number) {
    if (quantity == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    row.qty = quantity;
    this.calculateTotal(this.dataSource.data().slice());
    this.dataSource.update(copy);
  }

  itemValidator(items: FormArray) {
    if (items.length === 0) {
      return { items: true };
    } else {
      const itemList = items
        .getRawValue()
        .filter(item => item.item_name !== '');
      if (itemList.length !== items.length) {
        return { items: true };
      } else return null;
    }
  }

  updateRate(row: WarrantyItem, rate: number) {
    if (rate == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    if (row.minimumPrice && row.minimumPrice > rate) {
      row.rate = row.minimumPrice;
    } else {
      row.rate = rate;
    }
    this.calculateTotal(this.dataSource.data().slice());

    this.dataSource.update(copy);
  }

  calculateTotal(itemList: WarrantyItem[]) {
    let sum = 0;
    itemList.forEach(item => {
      sum += item.qty * item.rate;
    });
    this.serviceInvoiceForm.get('total').setValue(sum);
  }

  deleteRow(i: number) {
    this.dataSource.data().splice(i, 1);
    this.itemsControl.removeAt(i);
    this.calculateTotal(this.dataSource.data().slice());
    this.dataSource.update(this.dataSource.data());
  }

  getNameOption(option) {
    if (option) return option.name;
  }

  getCustOption(option) {
    if (option) return option.customer_name;
  }

  getOption(option) {
    if (option) return option;
  }

  customerChanged(option) {
    this.customerCode = option.name;
    this.serviceInvoiceForm.controls.customer_address.setValue({
      name: option?.customer_primary_address,
    });
    this.serviceInvoiceForm.controls.customer_contact.setValue(
      option?.customer_primary_contact,
    );
  }
}
