import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ValidateInputSelected } from '../../../common/pipes/validators';
import { WarrantyService } from '../../warranty-tabs/warranty.service';

@Component({
  selector: 'print-setting-dialog',
  templateUrl: 'print-setting-dialog.html',
})
export class PrintSettingDialog {
  printForm: FormGroup;
  printFormatList: Observable<any[]>;
  validateInput: any = ValidateInputSelected;
  constructor(
    public dialogRef: MatDialogRef<PrintSettingDialog>,
    public warrantyService: WarrantyService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit() {
    this.printForm = new FormGroup({
      printFormat: new FormControl('', Validators.required),
    });
    this.printFormatList = this.printForm
      .get('printFormat')
      .valueChanges.pipe(startWith(''), this.warrantyService.getPrintFormats());
  }

  get formControls() {
    return this.printForm.controls;
  }

  getPrintFormatOption(option) {
    if (option) {
      if (option.name) {
        return `${option.name}`;
      }
      return option.name;
    }
  }

  printDocument() {
    this.dialogRef.close(this.formControls.printFormat.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
