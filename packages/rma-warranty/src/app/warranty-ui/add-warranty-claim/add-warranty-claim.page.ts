import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeService } from '../../api/time/time.service';
import { AddWarrantyService } from './add-warranty.service';
import {
  startWith,
  switchMap,
  map,
  debounceTime,
  catchError,
} from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import {
  WarrantyState,
  SerialNoDetails,
  WarrantyItem,
  WarrantyClaimsDetails,
  WarrantyBulkProducts,
} from '../../common/interfaces/warranty.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CATEGORY, CLOSE, WARRANTY_TYPE } from './../../constants/app-string';
import {
  ITEM_BRAND_FETCH_ERROR,
  USER_SAVE_ITEM_SUGGESTION,
  ITEM_NOT_FOUND,
} from '../../constants/messages';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_SERVER_URL, TIME_ZONE } from '../../constants/storage';
import { DateTime } from 'luxon';
import { WarrantyService } from '../warranty-tabs/warranty.service';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { Observable, of } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-warranty-claim',
  templateUrl: './add-warranty-claim.page.html',
  styleUrls: ['./add-warranty-claim.page.scss'],
})
export class AddWarrantyClaimPage implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  uuid: string;

  claimList: string[] = [WARRANTY_TYPE.WARRANTY, WARRANTY_TYPE.NON_SERIAL];
  categoryList: string[] = [CATEGORY.BULK, CATEGORY.SINGLE];

  filteredCustomerList: Observable<any[]>;
  filteredProductList: Observable<any[]>;
  filteredTerritoryList: Observable<any[]>;
  filteredProblemList: Observable<any[]>;

  warrantyObject: WarrantyClaimsDetails;
  getSerialData: SerialNoDetails;
  warrantyState: WarrantyState;
  bulkProducts: WarrantyBulkProducts[] = [];
  itemDetail: any;
  displayedColumns = [
    'serial_no',
    'claim_type',
    'invoice_no',
    'warranty_end_date',
    'item_name',
    'product_brand',
    'problem',
    'item_code',
    'remove',
  ];

  warrantyClaimForm = new FormGroup({
    claim_type: new FormControl(WARRANTY_TYPE.WARRANTY, [Validators.required]),
    category: new FormControl(CATEGORY.SINGLE),

    customer_name: new FormControl(),
    customer_contact: new FormControl(),
    customer_address: new FormControl(),
    third_party_name: new FormControl(),
    third_party_contact: new FormControl(),
    third_party_address: new FormControl(),

    serial_no: new FormControl(),
    warranty_end_date: new FormControl(),
    product_name: new FormControl(),
    product_brand: new FormControl(),
    problem: new FormControl(),
    problem_details: new FormControl(),
    remarks: new FormControl(),
    invoice_no: new FormControl(),

    received_on: new FormControl(),
    receiving_branch: new FormControl(),
    delivery_date: new FormControl(),
    delivery_branch: new FormControl(),
  });
  validateInput: any = ValidateInputSelected;

  constructor(
    private readonly location: Location,
    private readonly time: TimeService,
    private readonly addWarrantyService: AddWarrantyService,
    private readonly loadingController: LoadingController,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly warrantyClaim: WarrantyService,
    private readonly dialog: MatDialog,
  ) {}

  get f() {
    return this.warrantyClaimForm.controls;
  }

  async ngOnInit() {
    this.uuid = this.activatedRoute.snapshot?.params?.uuid;
    if (this.uuid) {
      this.clearAllControlValidators();
      this.setValues();
    }
    this.warrantyState = {
      serial_no: { disabled: false, active: true },
      invoice_no: { disabled: false, active: true },
      warranty_end_date: { disabled: false, active: true },
      customer_contact: { disabled: true, active: true },
      customer_address: { disabled: true, active: true },
      product_name: { disabled: true, active: true },
      customer_name: { disabled: true, active: true },
      product_brand: { disabled: true, active: true },
      third_party_name: { disabled: true, active: true },
      third_party_contact: { disabled: true, active: true },
      third_party_address: { disabled: true, active: true },
      category: { disabled: true, active: true },
    };
    this.setDefaults();
    this.setAutoComplete();
  }

  navigateBack() {
    this.location.back();
  }

  setAutoComplete() {
    this.filteredCustomerList = this.f.customer_name.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.addWarrantyService.getRelayedCustomerList(),
    );

    this.filteredProductList = this.f.product_name.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.addWarrantyService.getItemList(),
    );

    this.filteredProblemList = this.f.problem.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      switchMap(value => {
        if (value == null) {
          value = '';
        }
        return this.addWarrantyService.getProblemList(value);
      }),
      map(res => res.docs),
    );

    this.addWarrantyService
      .getStorage()
      .getItem('territory')
      .then(territory => {
        this.filteredTerritoryList = of(territory);
      });
  }

  async setDefaults() {
    this.f.received_on.setValue(
      await (await this.getDateTime(new Date())).date,
    );
    this.f.delivery_date.setValue(await this.getDeliveryDate(new Date()));
    this.getFormState(this.f.claim_type.value);
    this.filteredTerritoryList.subscribe({
      next: territory => {
        this.f.receiving_branch.setValue(territory.find(branch => branch));
      },
    });
  }

  clearAllControlValidators() {
    Object.keys(this.f).forEach(element => {
      this.warrantyClaimForm.get(element).clearValidators();
      this.warrantyClaimForm.get(element).updateValueAndValidity();
    });
  }

  setValues() {
    this.warrantyClaim.getWarrantyClaim(this.uuid).subscribe({
      next: (res: WarrantyClaimsDetails) => {
        if (res.set === CATEGORY.BULK) {
          this.warrantyClaimForm.get('category').setValue(res.category);
          this.warrantyObject = res;
          return this.warrantyObject;
        }
        this.warrantyObject = res;
        Object.keys(this.f).forEach(element => {
          switch (element) {
            case 'product_name':
              this.warrantyClaimForm
                .get(element)
                .setValue({ item_name: res.item_name });
              break;
            case 'customer_name':
              this.warrantyClaimForm
                .get(element)
                .setValue({ customer_name: res.customer });
              break;
            case 'problem':
              this.warrantyClaimForm
                .get(element)
                .setValue({ problem_name: res.problem });
              break;
            default:
              this.warrantyClaimForm.get(element).setValue(res[element]);
              break;
          }
        });
      },
    });
  }

  mapUpdateClaim() {
    const updatePayload = {} as WarrantyClaimsDetails;
    updatePayload.uuid = this.warrantyObject.uuid;
    Object.keys(this.f).forEach(element => {
      switch (element) {
        case 'product_name':
          if (
            this.warrantyObject.item_name !==
            this.warrantyClaimForm.get(element).value.item_name
          )
            updatePayload.item_name = this.warrantyClaimForm.get(
              element,
            ).value.item_name;

          break;
        case 'customer_name':
          if (
            this.warrantyObject.customer !==
            this.warrantyClaimForm.get(element).value.name
          ) {
            updatePayload.customer = this.warrantyClaimForm.get(
              element,
            ).value.customer_name;
            updatePayload.customer_code = this.warrantyClaimForm.get(
              element,
            ).value.name;
          }
          break;
        case 'problem':
          if (
            this.warrantyObject[element] !==
            this.warrantyClaimForm.get(element).value.problem_name
          )
            updatePayload.problem = this.warrantyClaimForm.get(
              element,
            ).value.problem_name;
          break;
        default:
          if (
            this.warrantyObject[element] !==
            this.warrantyClaimForm.get(element).value
          )
            updatePayload[element] = this.warrantyClaimForm.get(element).value;
          break;
      }
    });
    return updatePayload;
  }

  async updateClaim() {
    const loading = await this.loadingController.create();
    await loading.present();
    const payload = this.mapUpdateClaim();
    if (this.warrantyObject.set === CATEGORY.BULK) {
      payload.bulk_products = this.bulkProducts;
      payload.category = this.warrantyObject.category;
      payload.set = this.warrantyObject.set;
      payload.subclaim_state = 'Draft';
    }
    this.addWarrantyService.updateWarrantyClaim(payload).subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/warranty']);
      },
      error: err => {
        loading.dismiss();
        this.presentSnackBar(err?.error.message);
      },
    });
  }

  getFormState(state: string) {
    switch (state) {
      case WARRANTY_TYPE.NON_SERIAL:
        this.warrantyState = {
          serial_no: { disabled: true, active: false },
          invoice_no: { disabled: true, active: false },
          warranty_end_date: { disabled: true, active: true },
          customer_contact: { disabled: false, active: true },
          customer_address: { disabled: false, active: true },
          product_name: { disabled: true, active: true },
          customer_name: { disabled: true, active: true },
          product_brand: { disabled: false, active: true },
          third_party_name: { disabled: true, active: true },
          third_party_contact: { disabled: true, active: true },
          third_party_address: { disabled: true, active: true },
          category: { disabled: true, active: true },
        };
        this.isDisabled();
        this.clearAllValidators(WARRANTY_TYPE.NON_SERIAL);
        break;

      case WARRANTY_TYPE.THIRD_PARTY:
        this.warrantyState = {
          serial_no: { disabled: true, active: true },
          invoice_no: { disabled: false, active: false },
          warranty_end_date: { disabled: true, active: true },
          customer_contact: { disabled: true, active: true },
          customer_address: { disabled: true, active: true },
          product_name: { disabled: true, active: true },
          customer_name: { disabled: true, active: true },
          product_brand: { disabled: true, active: true },
          third_party_name: { disabled: true, active: true },
          third_party_contact: { disabled: true, active: true },
          third_party_address: { disabled: true, active: true },
          category: { disabled: true, active: true },
        };
        this.isDisabled();
        this.f.invoice_no.reset();
        this.clearAllValidators(WARRANTY_TYPE.THIRD_PARTY);
        break;

      default:
        this.warrantyState = {
          serial_no: { disabled: true, active: true },
          invoice_no: { disabled: false, active: true },
          warranty_end_date: { disabled: false, active: true },
          customer_contact: { disabled: false, active: true },
          customer_address: { disabled: false, active: true },
          product_name: { disabled: false, active: true },
          customer_name: { disabled: false, active: true },
          product_brand: { disabled: false, active: true },
          third_party_name: { disabled: true, active: true },
          third_party_contact: { disabled: true, active: true },
          third_party_address: { disabled: true, active: true },
          category: { disabled: true, active: true },
        };
        this.isDisabled();
        this.clearAllValidators(WARRANTY_TYPE.WARRANTY);

        break;
    }
  }

  setValidators(type: string) {
    const obj = {
      Warranty: ['serial_no', 'invoice_no', 'customer_name'],
      'Non Serial Warranty': ['customer_name'],
      'Third Party Warranty': ['third_party_name', 'customer_name'],
    };
    obj[type].forEach(element => {
      this.warrantyClaimForm.get(element).setValidators(Validators.required);
      this.warrantyClaimForm.get(element).updateValueAndValidity();
    });
  }

  clearAllValidators(type: string) {
    const common_control = [
      'product_brand',
      'problem',
      'claim_type',
      'received_on',
      'delivery_date',
      'receiving_branch',
      'category',
      'warranty_end_date',
    ];
    this.clearAllControlValidators();
    common_control.forEach(element => {
      this.warrantyClaimForm.get(element).setValidators(Validators.required);
      this.warrantyClaimForm.get(element).updateValueAndValidity();
    });
    this.setValidators(type);
  }

  isDisabled() {
    Object.keys(this.warrantyState).forEach(key => {
      this.warrantyState[key].disabled
        ? this.f[key].enable()
        : this.f[key].disable();
    });
  }

  async getDateTime(date: Date) {
    const luxonDateTime = await this.time.getDateAndTime(date);
    return { date: luxonDateTime.date, time: luxonDateTime.time };
  }

  async getDeliveryDate(date: Date) {
    date.setDate(date.getDate() + 3);
    return (await this.getDateTime(date)).date;
  }

  async createClaim() {
    if (!this.warrantyClaimForm.valid) {
      this.presentSnackBar('Please enter missing fields.');
      this.warrantyClaimForm.markAllAsTouched();
      return;
    }
    const loading = await this.loadingController.create();
    await loading.present();
    const detail = await this.assignFields();
    if (this.f.category.value === CATEGORY.BULK) {
      if (detail.bulk_products?.length >= 1) {
        return this.addWarrantyService
          .createBulkWarrantyClaim(detail)
          .subscribe({
            next: () => {
              loading.dismiss();
              this.router.navigate(['/warranty']);
            },
            error: err => {
              loading.dismiss();
              this.presentSnackBar(err?.error?.message);
              this.openDialog();
            },
          });
      }
      loading.dismiss();
      this.presentSnackBar(`Please use single claim for one product`);
    }

    return this.addWarrantyService.createWarrantyClaim(detail).subscribe({
      next: () => {
        loading.dismiss();
        this.router.navigate(['/warranty']);
      },
      error: error => {
        loading.dismiss();
        this.presentSnackBar(
          error?.error?.message || 'Error in creating claim.',
        );
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(RetryDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.retryCheck) {
        return this.createClaim();
      }
    });
  }

  async assignFields() {
    const warrantyClaimDetails = {} as WarrantyClaimsDetails;
    warrantyClaimDetails.received_on = this.f.received_on.value;
    warrantyClaimDetails.delivery_date = this.f.delivery_date.value;
    warrantyClaimDetails.receiving_branch = this.f.receiving_branch.value;
    warrantyClaimDetails.delivery_branch = this.f.delivery_branch.value;
    warrantyClaimDetails.category = this.f.category.value;
    switch (this.f.category.value) {
      case CATEGORY.BULK:
        warrantyClaimDetails.bulk_products = this.bulkProducts;
        break;
      case CATEGORY.SINGLE:
        warrantyClaimDetails.set = CATEGORY.SINGLE;
        warrantyClaimDetails.claim_type = this.f.claim_type.value;
        warrantyClaimDetails.product_brand = this.f.product_brand.value;
        warrantyClaimDetails.problem = this.f.problem.value.problem_name;
        warrantyClaimDetails.problem_details = this.f.problem_details.value;
        warrantyClaimDetails.item_name = this.f.product_name.value.item_name;
        warrantyClaimDetails.item_code = this.itemDetail.item_code;
        break;

      default:
        this.presentSnackBar(`Please select a valid category`);
        break;
    }
    warrantyClaimDetails.remarks = this.f.remarks.value;
    warrantyClaimDetails.customer_contact = this.f.customer_contact.value;
    warrantyClaimDetails.customer_address = this.f.customer_address.value;
    warrantyClaimDetails.third_party_name = this.f.third_party_name.value;
    warrantyClaimDetails.third_party_contact = this.f.third_party_contact.value;
    warrantyClaimDetails.third_party_address = this.f.third_party_address.value;
    warrantyClaimDetails.customer = this.f.customer_name.value.customer_name;
    warrantyClaimDetails.warranty_claim_date = this.f.received_on.value;
    warrantyClaimDetails.customer_code = this.f.customer_name.value.name;
    warrantyClaimDetails.serial_no = this.f.serial_no.value;
    warrantyClaimDetails.invoice_no = this.f.invoice_no.value;
    warrantyClaimDetails.warranty_end_date = this.f.warranty_end_date.value;
    warrantyClaimDetails.posting_time = await (
      await this.getDateTime(new Date())
    ).time;
    return warrantyClaimDetails;
  }

  async customerChanged(customer) {
    const loading = await this.loadingController.create();
    await loading.present();
    return this.addWarrantyService.getRelayCustomer(customer.name).subscribe({
      next: (res: any) => {
        // this clearly needs rework. dont try to optimize. rewrite it.
        this.f.customer_name.setValue(res);

        if (!res.customer_primary_address) {
          if (!res.mobile_no) {
            this.presentSnackBar('Customer Address and Contact Not found');
            this.f.customer_contact.setValue('');
            this.f.customer_address.setValue('');
          } else {
            this.presentSnackBar('Customer Address Not found');
            this.f.customer_contact.setValue(res.mobile_no);
          }
        } else if (!res.mobile_no) {
          this.presentSnackBar('Customer Contact Not found');
          this.f.customer_address.setValue(res.customer_primary_address);
        } else {
          this.f.customer_contact.setValue(res.mobile_no);
          this.f.customer_address.setValue(res.customer_primary_address);
        }
        loading.dismiss();
      },
      error: err => {
        loading.dismiss();
        this.presentSnackBar(err?.error?.message || 'Error fetching Customer');
      },
    });
  }

  getCustomerNameOption(option) {
    if (option) return option.customer_name;
  }

  getItemOption(option) {
    if (option) return option.item_name;
  }

  getProblemOption(option) {
    if (option) return option.problem_name;
  }

  checkSerial(serialNo) {
    return this.addWarrantyService.getSerial(serialNo).pipe(
      switchMap((res: SerialNoDetails) => {
        if (res.claim_no) {
          this.presentSnackBar(
            `Claim already exists serial no ${res.serial_no}`,
          );
          return of(false);
        }
        if (!res.customer) {
          this.presentSnackBar('Serial not sold linked to customer.');
          return of(false);
        }
        if (
          res.delivery_note ? res.delivery_note.split('-')[0] === 'WSDR' : false
        ) {
          this.presentSnackBar('Cannot Create Claim of Stocked Serial');
          return of(false);
        }
        return of(true);
      }),
      catchError(err => {
        return of(err);
      }),
    );
  }

  async serialChanged(name) {
    this.claimList = [
      WARRANTY_TYPE.WARRANTY,
      WARRANTY_TYPE.NON_WARRANTY,
      WARRANTY_TYPE.NON_SERIAL,
      WARRANTY_TYPE.THIRD_PARTY,
    ];
    this.f.claim_type.enable();
    const timeZone = await this.addWarrantyService
      .getStorage()
      .getItem(TIME_ZONE);
    this.addWarrantyService.getSerial(name).subscribe({
      next: (res: SerialNoDetails) => {
        this.getSerialData = res;
        if (res.claim_no) {
          this.presentSnackBar(
            `Claim already exists for serial no ${res.serial_no}`,
          );
          return false;
        }
        if (!res.customer) {
          this.presentSnackBar('Serial not sold or linked to customer.');
          return false;
        }
        if (
          res.delivery_note ? res.delivery_note.split('-')[0] === 'WSDR' : false
        ) {
          this.presentSnackBar('Cannot Create Claim of Stocked Serial');
          return false;
        }

        if (!this.getSerialData.warranty.salesWarrantyDate) {
          this.f.claim_type.setValue(WARRANTY_TYPE.NON_WARRANTY);
        } else {
          if (
            DateTime.fromISO(this.f.received_on.value)
              .setZone(timeZone)
              .toFormat('yyyy-MM-dd') <
            DateTime.fromISO(this.getSerialData.warranty.salesWarrantyDate)
              .setZone(timeZone)
              .toFormat('yyyy-MM-dd')
          ) {
            this.f.claim_type.setValue(WARRANTY_TYPE.WARRANTY);
          } else {
            this.f.claim_type.setValue(WARRANTY_TYPE.NON_WARRANTY);
          }
        }
        this.f.warranty_end_date.setValue(res.warranty.salesWarrantyDate);
        this.f.invoice_no.setValue(res.sales_invoice_name);
        this.f.warranty_end_date.setValue(
          res.warranty.salesWarrantyDate
            ? new Date(res.warranty.salesWarrantyDate)
            : '',
        );
        this.f.product_name.setValue({
          item_name: res.item_name,
        });
        this.f.customer_name.setValue({
          name: res.customer,
        });
        this.itemOptionChanged({ item_code: res.item_code });
        this.customerChanged({ name: res.customer });
      },
      error: error => {
        this.presentSnackBar(
          error?.error?.message || 'Error Fetching provided serial.',
        );
      },
    });
  }

  dateChanges(option) {
    this.getDateTime(option).then(date => {
      switch (this.f.claim_type.value) {
        case WARRANTY_TYPE.WARRANTY:
          this.validateWarrantyDate(date);

        case WARRANTY_TYPE.NON_WARRANTY:
          this.validateWarrantyDate(date);

        default:
          this.f.claim_type.setValue(this.f.claim_type.value);
          break;
      }
    });
  }

  validateWarrantyDate(date: any) {
    if (this.f.received_on.value < date.date) {
      this.f.claim_type.setValue(WARRANTY_TYPE.WARRANTY);
      return '';
    }
    this.f.claim_type.setValue(WARRANTY_TYPE.NON_WARRANTY);
    return '';
  }

  itemOptionChanged(option) {
    this.addWarrantyService.getItem(option.item_code).subscribe({
      next: (res: WarrantyItem) => {
        this.itemDetail = res;
        if (!res.brand) {
          this.getItemBrandFromERP(res.item_code);
        }

        if (res.has_serial_no) {
          this.f.serial_no.enable();
        } else {
          this.f.serial_no.setValue('');
          this.f.serial_no.disable();
        }

        this.f.product_brand.setValue(res.brand);
      },
      error: ({ message }) => {
        if (!message) message = `${ITEM_NOT_FOUND}`;
        this.presentSnackBar(message);
      },
    });
  }

  getItemBrandFromERP(item_code: string) {
    this.addWarrantyService.getItemBrandFromERP(item_code).subscribe({
      next: res => {
        if (!res.brand) {
          this.presentSnackBar(ITEM_BRAND_FETCH_ERROR);
        } else {
          this.snackbar
            .open(USER_SAVE_ITEM_SUGGESTION, 'open item', {
              duration: 5500,
            })
            .onAction()
            .subscribe(() => {
              this.openERPItem(item_code);
            });
          this.f.product_brand.setValue(res.brand);
        }
      },
      error: () => {
        this.presentSnackBar(ITEM_NOT_FOUND);
      },
    });
  }

  openERPItem(item_code: string) {
    this.addWarrantyService
      .getStorage()
      .getItem(AUTH_SERVER_URL)
      .then(auth_url => {
        window.open(`${auth_url}/desk#Form/Item/${item_code}`, '_blank');
      });
  }

  appendProduct() {
    if (this.validateProduct()) {
      this.checkSerial(this.f.serial_no.value).subscribe({
        next: res => {
          if (res) {
            this.bulkProducts = this.bulkProducts.concat({
              received_on: this.f.received_on.value,
              delivery_date: this.f.delivery_date.value,
              remarks: this.f.remarks.value,
              customer_contact: this.f.customer_contact.value,
              customer_address: this.f.customer_address.value,
              third_party_name: this.f.third_party_name.value,
              third_party_contact: this.f.third_party_contact.value,
              third_party_address: this.f.third_party_address.value,
              customer: this.f.customer_name.value.customer_name,
              warranty_claim_date: this.f.received_on.value,
              customer_code: this.f.customer?.value?.name,
              claim_type: this.f.claim_type.value,
              product_brand: this.f.product_brand.value,
              problem: this.f.problem.value.problem_name,
              problem_details: this.f.problem_details.value,
              item_name: this.f.product_name.value.item_name,
              item_code: this.itemDetail.item_code,
              serial_no: this.f.serial_no.value,
              invoice_no: this.f.invoice_no.value,
              warranty_end_date: this.f.warranty_end_date.value,
              delivery_branch: this.f.delivery_branch.value,
            });
          }
        },
      });
    }
  }

  validateProduct() {
    let check: boolean;
    if (this.bulkProducts.length) {
      for (const product of this.bulkProducts) {
        if (
          product.serial_no === this.f.serial_no.value &&
          product.claim_type !== WARRANTY_TYPE.NON_SERIAL
        ) {
          this.presentSnackBar('Serial Already Exists');
          check = false;
        } else {
          check = true;
        }
      }
    } else {
      check = true;
    }
    return check;
  }

  clearProductDetails() {
    this.f.serial_no.enable();
    this.f.claim_type.enable();
    this.f.serial_no.reset();
    this.f.warranty_end_date.reset();
    this.f.product_name.reset();
    this.f.product_brand.reset();
    this.f.problem.reset();
    this.f.problem_details.reset();
    this.f.remarks.reset();
    this.f.invoice_no.reset();
    this.setAutoComplete();
  }

  removeSubClaim(index: number) {
    this.bulkProducts.splice(index, 1);
    this.table.renderRows();
  }

  presentSnackBar(message: string) {
    this.snackbar.open(message, CLOSE);
  }

  columnHeader(column: string) {
    return column.charAt(0).toUpperCase() + column.slice(1).replace(/_/g, ' ');
  }
}

@Component({
  selector: 'retry-dialog-component',
  templateUrl: 'retry-dialog-component.html',
})
export class RetryDialogComponent {
  retryCheck: boolean = false;
  constructor(private matDialogRef: MatDialogRef<RetryDialogComponent>) {}
  onNoClick() {
    this.retryCheck = false;
    this.matDialogRef.close();
  }

  Retry() {
    this.retryCheck = true;
    this.matDialogRef.close();
  }
}
