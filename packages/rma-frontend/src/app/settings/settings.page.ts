import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SettingsService } from './settings.service';
import { startWith, debounceTime } from 'rxjs/operators';
import { ToastController, PopoverController } from '@ionic/angular';
import {
  SHORT_DURATION,
  UPDATE_SUCCESSFUL,
  UPDATE_ERROR,
  CLOSE,
} from '../constants/app-string';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TerritoryDataSource } from './territory-datasource';
import { MapTerritoryComponent } from './map-territory/map-territory.component';
import { ValidateInputSelected } from '../common/pipes/validators';
import { PermissionManager } from '../api/permission/permission.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  hideSASecret: boolean = true;
  hideSAApiSecret: boolean = true;
  group: boolean = false;

  companySettingsForm = new FormGroup({
    authServerURL: new FormControl(),
    appURL: new FormControl(),
    warrantyAppURL: new FormControl(),
    defaultCompany: new FormControl(),
    frontendClientId: new FormControl(),
    backendClientId: new FormControl(),
    serviceAccountUser: new FormControl(),
    serviceAccountSecret: new FormControl(),
    sellingPriceList: new FormControl(),
    timeZone: new FormControl(),
    validateStock: new FormControl(),
    transferWarehouse: new FormControl(),
    debtorAccount: new FormControl(),
    serviceAccountApiKey: new FormControl(),
    serviceAccountApiSecret: new FormControl(),
    posProfile: new FormControl(),
    headerImageURL: new FormControl(),
    headerWidth: new FormControl(),
    footerImageURL: new FormControl(),
    footerWidth: new FormControl(),
    faviconURL: new FormControl(),
    backdatedInvoices: new FormControl(),
    backdatedInvoicesForDays: new FormControl(),
    posAppURL: new FormControl(),
  });
  validateInput: any = ValidateInputSelected;

  companies: Observable<unknown[]> = this.companySettingsForm
    .get('defaultCompany')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayCompaniesOperation(),
    );

  sellingPriceLists: Observable<unknown[]> = this.companySettingsForm
    .get('sellingPriceList')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relaySellingPriceListsOperation(),
    );

  timezones: Observable<unknown[]> = this.companySettingsForm
    .get('timeZone')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayTimeZoneOperation(),
    );

  accounts: Observable<unknown[]> = this.companySettingsForm
    .get('debtorAccount')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayAccountsOperation(),
    );

  warehouses: Observable<unknown[]> = this.companySettingsForm
    .get('transferWarehouse')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayWarehousesOperation(),
    );

  posProfiles: Observable<unknown[]> = this.companySettingsForm
    .get('posProfile')
    .valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayPosProfiles(),
    );

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  territoryDataSource: TerritoryDataSource;

  displayedColumns = ['name', 'warehouse'];
  search: string = '';

  constructor(
    private readonly location: Location,
    private readonly service: SettingsService,
    private readonly toastController: ToastController,
    private readonly popoverController: PopoverController,
    private readonly permissionManager: PermissionManager,
  ) {}

  ngOnInit() {
    this.service.getSettings().subscribe({
      next: res => {
        this.companySettingsForm
          .get('authServerURL')
          .setValue(res.authServerURL);
        this.companySettingsForm.get('appURL').setValue(res.appURL);
        this.companySettingsForm
          .get('defaultCompany')
          .setValue(res.defaultCompany);
        this.companySettingsForm
          .get('frontendClientId')
          .setValue(res.frontendClientId);
        this.companySettingsForm
          .get('backendClientId')
          .setValue(res.backendClientId);
        this.companySettingsForm
          .get('serviceAccountUser')
          .setValue(res.serviceAccountUser);
        this.companySettingsForm
          .get('serviceAccountSecret')
          .setValue(res.serviceAccountSecret);
        this.companySettingsForm
          .get('sellingPriceList')
          .setValue(res.sellingPriceList);
        this.companySettingsForm.get('timeZone').setValue(res.timeZone);
        this.companySettingsForm
          .get('validateStock')
          .setValue(res.validateStock);
        this.companySettingsForm
          .get('debtorAccount')
          .setValue(res.debtorAccount);
        this.companySettingsForm
          .get('transferWarehouse')
          .setValue(res.transferWarehouse);
        this.companySettingsForm
          .get('serviceAccountApiKey')
          .setValue(res.serviceAccountApiKey);
        this.companySettingsForm
          .get('serviceAccountApiSecret')
          .setValue(res.serviceAccountApiSecret);
        this.companySettingsForm
          .get('warrantyAppURL')
          .setValue(res.warrantyAppURL);
        this.companySettingsForm.get('posAppURL').setValue(res.posAppURL);
        this.companySettingsForm.get('posProfile').setValue(res.posProfile);
        this.companySettingsForm
          .get('headerImageURL')
          .setValue(res.headerImageURL);
        this.companySettingsForm.get('headerWidth').setValue(res.headerWidth);
        this.companySettingsForm
          .get('footerImageURL')
          .setValue(res.footerImageURL);
        this.companySettingsForm.get('footerWidth').setValue(res.footerWidth);
        this.companySettingsForm
          .get('backdatedInvoices')
          .setValue(res.backdatedInvoices);
        this.companySettingsForm
          .get('backdatedInvoicesForDays')
          .setValue(res.backdatedInvoicesForDays);
        if (res.brand?.faviconURL) {
          this.companySettingsForm
            .get('faviconURL')
            .setValue(res.brand.faviconURL);
          this.service.setFavicon(res.brand.faviconURL);
        }
      },
    });

    this.territoryDataSource = new TerritoryDataSource(this.service);
    this.territoryDataSource.loadItems(
      undefined,
      undefined,
      undefined,
      undefined,
      this.group,
    );
  }

  navigateBack() {
    this.location.back();
  }

  get f() {
    return this.companySettingsForm.controls;
  }

  updateSettings() {
    this.service
      .updateSettings(
        this.companySettingsForm.get('authServerURL').value,
        this.companySettingsForm.get('appURL').value,
        this.companySettingsForm.get('posAppURL').value,
        this.companySettingsForm.get('defaultCompany').value,
        this.companySettingsForm.get('frontendClientId').value,
        this.companySettingsForm.get('backendClientId').value,
        this.companySettingsForm.get('serviceAccountUser').value,
        this.companySettingsForm.get('serviceAccountSecret').value,
        this.companySettingsForm.get('sellingPriceList').value,
        this.companySettingsForm.get('timeZone').value,
        this.companySettingsForm.get('validateStock').value,
        this.companySettingsForm.get('debtorAccount').value,
        this.companySettingsForm.get('transferWarehouse').value,
        this.companySettingsForm.get('serviceAccountApiKey').value,
        this.companySettingsForm.get('serviceAccountApiSecret').value,
        this.companySettingsForm.get('warrantyAppURL').value,
        this.companySettingsForm.get('posProfile').value,
        this.companySettingsForm.get('headerImageURL').value,
        this.companySettingsForm.get('headerWidth').value,
        this.companySettingsForm.get('footerImageURL').value,
        this.companySettingsForm.get('footerWidth').value,
        this.companySettingsForm.get('backdatedInvoices').value,
        this.companySettingsForm.get('backdatedInvoicesForDays').value,
        {
          faviconURL: this.companySettingsForm.get('faviconURL').value,
        },
      )
      .subscribe({
        next: () => {
          this.service.setFavicon(this.f.faviconURL.value);
          this.permissionManager.setGlobalPermissions(
            this.f.backdatedInvoices.value,
            this.f.backdatedInvoicesForDays?.value,
          );
          this.toastController
            .create({
              message: UPDATE_SUCCESSFUL,
              duration: SHORT_DURATION,
              buttons: [{ text: CLOSE }],
            })
            .then(toast => toast.present());
        },
        error: () => {
          this.toastController
            .create({
              message: UPDATE_ERROR,
              duration: SHORT_DURATION,
              buttons: [{ text: CLOSE }],
            })
            .then(toast => toast.present());
        },
      });
  }

  getUpdate(event) {
    this.territoryDataSource.loadItems(
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
      this.group,
    );
  }

  setFilter(value?) {
    this.territoryDataSource.loadItems(
      this.search,
      this.sort.direction,
      0,
      30,
      value !== undefined ? value : this.group,
    );
  }

  getChips(warehouse) {
    if (typeof warehouse === 'string') {
      return [warehouse];
    }
    return warehouse;
  }

  async mapTerritory(uuid?: string, territory?: string, warehouse?: string) {
    if (this.group) {
      this.toastController
        .create({
          message:
            'Territory cannot be edited as group, please deselect group.',
          duration: SHORT_DURATION,
          buttons: [{ text: CLOSE }],
        })
        .then(toast => toast.present());
      return;
    }
    const popover = await this.popoverController.create({
      component: MapTerritoryComponent,
      componentProps: { uuid, territory, warehouse },
    });
    popover.onDidDismiss().then(() => {
      this.territoryDataSource.loadItems(
        undefined,
        undefined,
        undefined,
        undefined,
        this.group,
      );
    });
    return await popover.present();
  }
}
