import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WarrantyClaimsDataSource } from './warranty-claims-datasource';
import { Location } from '@angular/common';
import { WarrantyService } from '../warranty-tabs/warranty.service';
import { WarrantyClaims } from '../../common/interfaces/warranty.interface';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, startWith, switchMap } from 'rxjs/operators';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import {
  CATEGORY,
  CLAIM_STATUS,
  DATE_TYPE,
  WARRANTY_CLAIMS_CSV_FILE,
  WARRANTY_CLAIMS_DOWNLOAD_HEADERS,
  WARRANTY_TYPE,
} from '../../constants/app-string';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.page.html',
  styleUrls: ['./warranty.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class WarrantyPage implements OnInit {
  warrantyClaimsList: Array<WarrantyClaims>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  permissionState = PERMISSION_STATE;
  dataSource: WarrantyClaimsDataSource;
  displayedColumns = [
    'sr_no',
    'claim_no',
    'claim_type',
    'received_date',
    'customer_name',
    'third_party_name',
    'item_code',
    'claimed_serial',
    'claim_status',
    'receiving_branch',
    'delivery_branch',
    'received_by',
    'delivered_by',
    'product_brand',
    'replace_serial',
    'problem',
    'verdict',
    'delivery_date',
    'billed_amount',
    'outstanding_amount',
    'remarks',
  ];
  claimList;
  bulkFlag: boolean = false;
  filteredCustomerList: Observable<any[]>;
  filteredBrandList: any;
  filteredBrand: any = [];
  filteredProductList: Observable<any[]>;
  filteredTerritoryList: Observable<any[]>;
  sortQuery: any = {};
  territoryList;
  claim_status: string = CLAIM_STATUS.ALL;
  claimStatusList: string[] = [
    CLAIM_STATUS.IN_PROGRESS,
    CLAIM_STATUS.TO_DELIVER,
    CLAIM_STATUS.DELIVERED,
    CLAIM_STATUS.REJECTED,
    CLAIM_STATUS.ALL,
  ];
  dateTypeList: string[] = [DATE_TYPE.RECEIVED_DATE, DATE_TYPE.DELIVERED_DATE];
  validateInput: any = ValidateInputSelected;
  warrantyForm: FormGroup;

  get f() {
    return this.warrantyForm.controls;
  }

  constructor(
    private readonly location: Location,
    private readonly warrantyService: WarrantyService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly csvService: CsvJsonService,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.claimList = [
      WARRANTY_TYPE.WARRANTY,
      WARRANTY_TYPE.NON_WARRANTY,
      WARRANTY_TYPE.NON_SERIAL,
      WARRANTY_TYPE.THIRD_PARTY,
    ];
    this.dataSource = new WarrantyClaimsDataSource(this.warrantyService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => {
          if (event.url === '/warranty') {
            this.dataSource.loadItems(
              undefined,
              undefined,
              undefined,
              {},
              {
                set: [CATEGORY.BULK, CATEGORY.SINGLE, CATEGORY.PART],
              },
            );
          }
          return event;
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });

    this.filteredCustomerList = this.warrantyForm
      .get('customer_name')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.warrantyService.getCustomerList(value);
        }),
      );
    this.warrantyService.getBrandList().subscribe(data => {
      this.filteredBrandList = data;
    });
    this.warrantyForm.get('brand').valueChanges.subscribe(newValue => {
      this.warrantyService.getBrandList().subscribe(data => {
        this.filteredBrand = data;
        this.filteredBrandList = this.filterBrand(newValue);
      });
    });

    this.filteredProductList = this.warrantyForm
      .get('product')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.warrantyService.getItemList({ item_name: value });
        }),
      );

    this.filteredTerritoryList = this.warrantyForm
      .get('territory')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.warrantyService
            .getStorage()
            .getItemAsync('territory', value);
        }),
      );
  }

  filterBrand(name) {
    if (this.filteredBrand) {
      return this.filteredBrand.filter(
        value => value.toLowerCase().indexOf(name.toLowerCase()) !== -1,
      );
    }
  }

  createFormGroup() {
    this.warrantyForm = new FormGroup({
      customer_name: new FormControl(''),
      claim_no: new FormControl(''),
      third_party_name: new FormControl(''),
      product: new FormControl(''),
      brand: new FormControl(''),
      claim_status: new FormControl(''),
      claim_type: new FormControl(''),
      territory: new FormControl(''),
      serial_no: new FormControl(''),
      replace_serial: new FormControl(''),
      received_by: new FormControl(''),
      delivered_by: new FormControl(''),
      date_type: new FormControl(''),
      from_date: new FormControl(''),
      to_date: new FormControl(''),
      singleDate: new FormControl(''),
    });
  }

  getUpdate(event?) {
    const query: any = {};
    if (this.f.customer_name.value)
      query.customer = this.f.customer_name.value.customer_name;
    if (this.f.claim_no.value) query.claim_no = this.f.claim_no.value;
    if (this.f.third_party_name.value)
      query.third_party_name = this.f.third_party_name.value;
    if (this.f.product.value) query.item_name = this.f.product.value.item_name;
    if (this.f.brand.value) query.product_brand = this.f.brand.value;
    if (this.claim_status) query.claim_status = this.claim_status;
    if (this.f.claim_type.value) query.claim_type = this.f.claim_type.value;
    if (this.f.territory.value) query.receiving_branch = this.f.territory.value;
    if (this.f.serial_no.value) query.serial_no = this.f.serial_no.value;
    if (this.f.replace_serial.value)
      query.replace_serial = this.f.replace_serial.value;
    if (this.f.received_by.value) query.received_by = this.f.received_by.value;
    if (this.f.delivered_by.value)
      query.delivered_by = this.f.delivered_by.value;
    if (this.f.from_date.value && this.f.to_date.value) {
      query.date_type = this.f.date_type.value;
      query.from_date = new Date(this.f.from_date.value).setHours(0, 0, 0, 0);
      query.to_date = new Date(this.f.to_date.value).setHours(23, 59, 59, 59);
    }

    if (this.f.singleDate.value) {
      query.date_type = this.f.date_type.value;
      query.from_date = new Date(this.f.singleDate.value).setHours(0, 0, 0, 0);
      query.to_date = new Date(this.f.singleDate.value).setHours(
        23,
        59,
        59,
        59,
      );
    }
    this.paginator.pageIndex = event?.pageIndex || 0;
    this.paginator.pageSize = event?.pageSize || 30;
    this.sortQuery =
      Object.keys(this.sortQuery).length === 0
        ? { createdOn: 'desc' }
        : this.sortQuery;
    if (this.bulkFlag === true) {
      this.dataSource.loadItems(
        this.sortQuery,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        query,
        {
          territory: this.territoryList,
          set: [CATEGORY.BULK],
        },
      );
    } else {
      this.dataSource.loadItems(
        this.sortQuery,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        query,
        {
          territory: this.territoryList,
          set: [CATEGORY.SINGLE, CATEGORY.PART],
        },
      );
    }
  }

  setFilter(event?) {
    const query: any = {};
    if (this.f.customer_name.value)
      query.customer = this.f.customer_name.value.customer_name;
    if (this.f.claim_no.value) query.claim_no = this.f.claim_no.value;
    if (this.f.third_party_name.value)
      query.third_party_name = this.f.third_party_name.value;
    if (this.claim_status) query.claim_status = this.claim_status;
    if (this.f.product.value) query.item_name = this.f.product.value.item_name;
    if (this.f.brand.value) query.product_brand = this.f.brand.value;
    if (this.f.claim_type.value) query.claim_type = this.f.claim_type.value;
    if (this.f.territory.value) query.receiving_branch = this.f.territory.value;
    if (this.f.serial_no.value) query.serial_no = this.f.serial_no.value;
    if (this.f.replace_serial.value)
      query.replace_serial = this.f.replace_serial.value;
    if (this.f.received_by.value) query.received_by = this.f.received_by.value;
    if (this.f.delivered_by.value)
      query.delivered_by = this.f.delivered_by.value;

    if (this.f.from_date.value && this.f.to_date.value) {
      query.date_type = this.f.date_type.value;
      query.from_date = new Date(this.f.from_date.value).setHours(0, 0, 0, 0);
      query.to_date = new Date(this.f.to_date.value).setHours(23, 59, 59, 59);
    }

    if (this.f.singleDate.value) {
      query.date_type = this.f.date_type.value;
      query.from_date = new Date(this.f.singleDate.value).setHours(0, 0, 0, 0);
      query.to_date = new Date(this.f.singleDate.value).setHours(
        23,
        59,
        59,
        59,
      );
    }

    this.sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          this.sortQuery[event[key]] = event.direction;
        }
      }
    }

    this.dataSource.loadItems(this.sortQuery, undefined, undefined, query, {
      territory: this.territoryList,
      set: [CATEGORY.BULK, CATEGORY.SINGLE, CATEGORY.PART],
    });

    this.getUpdate();
  }

  getBulkClaims() {
    this.bulkFlag = true;
    this.dataSource.loadItems(undefined, undefined, undefined, undefined, {
      territory: this.territoryList,
      set: [CATEGORY.BULK],
    });
  }

  statusChange(status) {
    if (status === 'All') {
      this.dataSource.loadItems(undefined, undefined, undefined, undefined, {
        territory: this.territoryList,
        set: [CATEGORY.BULK, CATEGORY.SINGLE, CATEGORY.PART],
      });
    } else {
      this.claim_status = status;
      this.setFilter();
    }
  }

  dateFilter() {
    this.f.singleDate.setValue('');
    this.setFilter();
  }

  singleDateFilter() {
    this.f.from_date.setValue('');
    this.f.to_date.setValue('');
    this.setFilter();
  }

  clearFilters() {
    this.f.customer_name.setValue('');
    this.f.claim_no.setValue('');
    this.f.third_party_name.setValue('');
    this.f.product.setValue('');
    this.f.brand.setValue('');
    this.f.claim_status.setValue('');
    this.f.claim_type.setValue('');
    this.f.territory.setValue('');
    this.f.serial_no.setValue('');
    this.f.received_by.setValue('');
    this.f.delivered_by.setValue('');
    this.f.from_date.setValue('');
    this.f.to_date.setValue('');
    this.f.singleDate.setValue('');
    this.f.replace_serial.setValue('');
    this.f.date_type.setValue(DATE_TYPE.RECEIVED_DATE);
    this.paginator.pageSize = 30;
    this.paginator.firstPage();
    this.dataSource.loadItems(undefined, undefined, undefined, undefined, {
      territory: this.territoryList,
      set: [CATEGORY.BULK, CATEGORY.SINGLE, CATEGORY.PART],
    });
    this.bulkFlag = false;
  }

  navigateBack() {
    this.location.back();
  }

  getCustomerOption(option) {
    return option.customer_name;
  }

  getBrandOption(option) {
    return option;
  }

  getProductOption(option) {
    return option.item_name;
  }

  getOption(option) {
    return option;
  }

  warrantyRoute(row: any) {
    this.dataSource.loadItems(
      undefined,
      undefined,
      undefined,
      { parent: row.uuid },
      {
        territory: this.territoryList,
        set: [CATEGORY.PART],
      },
    );
  }

  downloadSerials() {
    this.csvService.downloadAsCSV(
      this.dataSource.data,
      WARRANTY_CLAIMS_DOWNLOAD_HEADERS,
      `${WARRANTY_CLAIMS_CSV_FILE}`,
    );
  }
}

@Component({
  selector: 'assign-serials-dialog',
  templateUrl: 'assign-serials-dialog.html',
})
export class AssignSerialsDialog {
  constructor(
    public dialogRef: MatDialogRef<AssignSerialsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
