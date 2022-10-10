import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { TermsAndConditionsService } from '../services/TermsAndConditions/terms-and-conditions.service';

@Component({
  selector: 'app-add-terms-and-conditions',
  templateUrl: './add-terms-and-conditions.page.html',
  styleUrls: ['./add-terms-and-conditions.page.scss'],
})
export class AddTermsAndConditionsPage implements OnInit {
  @Input() passedFrom: string = '';
  @Input() uuid?: string = '';
  termsAndConditionsFormControl = new FormControl('', Validators.required);
  disableAction: boolean = true;
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
    private readonly popoverCtrl: PopoverController,
  ) {}

  ngOnInit() {
    this.termsAndConditionsFormControl.valueChanges.subscribe(value => {
      if (value !== '') this.disableAction = false;
      else this.disableAction = true;
    });
    if (this.passedFrom === 'update') this.getTermsAndConditions();
  }

  getTermsAndConditions() {
    this.termsAndConditionsService.getTermsAndConditions(this.uuid).subscribe({
      next: res => {
        this.termsAndConditionsFormControl.setValue(res.terms_and_conditions);
      },
    });
  }

  addTermsAndConditions() {
    this.termsAndConditionsService
      .addTermsAndConditions(this.termsAndConditionsFormControl.value)
      .subscribe({
        next: res => {
          this.popoverCtrl.dismiss({
            success: true,
          });
        },
      });
  }

  onCancel() {
    this.popoverCtrl.dismiss({
      success: false,
    });
  }

  updateTermsAndConditions() {
    this.termsAndConditionsService
      .updateTermsAndConditions(
        this.termsAndConditionsFormControl.value,
        this.uuid,
      )
      .subscribe({
        next: res => {
          this.popoverCtrl.dismiss({
            success: true,
          });
        },
      });
  }
}
