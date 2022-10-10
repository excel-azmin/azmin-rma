import { Component, OnInit, Input, Optional, Host } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: 'edit-price',
  templateUrl: './edit-price.component.html',
  styleUrls: ['./edit-price.component.scss'],
})
export class EditPriceComponent implements OnInit {
  @Input()
  get value(): any {
    return this._value;
  }
  set value(val) {
    this.frmCtrl.setValue({ minimumPrice: val });
    this.rate = val;
    this._value = val;
  }
  private _value = '';
  rate: number = 0.0;

  frmCtrl = new FormControl();

  @Input()
  column: string;

  constructor(@Optional() @Host() public popover: SatPopover) {}

  ngOnInit() {}

  onSubmit() {
    if (this.popover) {
      this.popover.close(this.rate);
    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
