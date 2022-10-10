import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

import { UpdateCreditLimitService } from './update-credit-limit.service';
import {
  UPDATE_ERROR,
  SHORT_DURATION,
  CLOSE,
} from '../../constants/app-string';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';

@Component({
  selector: 'app-update-credit-limit',
  templateUrl: './update-credit-limit.component.html',
  styleUrls: ['./update-credit-limit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UpdateCreditLimitComponent implements OnInit {
  uuid: string;
  customer: string;
  baseCreditLimit: string;
  currentCreditLimit: string;
  expiryDate: string;

  creditLimitForm = new FormGroup({
    customer: new FormControl(),
    baseLimit: new FormControl(),
    erpnextLimit: new FormControl(),
    expiryDate: new FormControl(),
  });

  constructor(
    private readonly navParams: NavParams,
    private readonly popoverCtrl: PopoverController,
    private readonly toastCtrl: ToastController,
    private readonly service: UpdateCreditLimitService,
  ) {}

  ngOnInit() {
    this.uuid = this.navParams.data.uuid;
    this.customer = this.navParams.data.customer;
    this.baseCreditLimit = this.navParams.data.baseCreditLimit;
    this.currentCreditLimit = this.navParams.data.currentCreditLimit;
    this.expiryDate = this.navParams.data.expiryDate;
    this.creditLimitForm.get('customer').setValue(this.customer);
    this.creditLimitForm.get('baseLimit').setValue(this.baseCreditLimit);
    this.creditLimitForm.get('baseLimit').disable();
    this.creditLimitForm.get('erpnextLimit').setValue(this.currentCreditLimit);
    this.creditLimitForm.get('erpnextLimit').disable();
    this.creditLimitForm.get('expiryDate').setValue(this.expiryDate);
    this.creditLimitForm.get('expiryDate').disable();
  }

  async onCancel() {
    return await this.popoverCtrl.dismiss();
  }

  onUpdate() {
    this.service
      .update(
        this.uuid,
        this.creditLimitForm.controls.customer.value,
        this.creditLimitForm.controls.baseLimit.value,
        this.creditLimitForm.controls.expiryDate.value,
        this.creditLimitForm.controls.erpnextLimit.value,
      )
      .subscribe({
        next: res => {
          this.popoverCtrl.dismiss().then(dismissed => {});
        },
        error: error => {
          let frappeError = UPDATE_ERROR;

          try {
            frappeError = JSON.parse(error.error._server_messages);
            frappeError = JSON.parse(frappeError);
            frappeError = (frappeError as { message?: string }).message;
          } catch {}

          this.toastCtrl
            .create({
              message: frappeError,
              duration: SHORT_DURATION,
              buttons: [{ text: CLOSE }],
            })
            .then(toast => toast.present());
        },
      });
  }

  toggleBaseLimit() {
    if (this.creditLimitForm.controls.baseLimit.disabled) {
      this.creditLimitForm.controls.baseLimit.enable();
    }
  }

  toggleERPNextLimit() {
    if (this.creditLimitForm.controls.erpnextLimit.disabled) {
      this.creditLimitForm.controls.erpnextLimit.enable();
    }
  }

  toggleExpiryDate() {
    if (this.creditLimitForm.controls.expiryDate.disabled) {
      this.creditLimitForm.controls.expiryDate.enable();
    }
  }
}
