import { Component, OnInit, Input, Optional, Host } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'edit-purchase-table',
  templateUrl: './edit-purchase-table.component.html',
  styleUrls: ['./edit-purchase-table.component.scss'],
})
export class EditPurchaseTableComponent implements OnInit {
  @Input()
  get value(): any {
    return this._value;
  }
  set value(x) {
    this._value = x;
    this.serial_no = x;
  }

  private _value = '';
  itemFormControl = new FormControl();
  filteredItemList: Observable<any[]>;
  comment = '';
  serial_no: string = '';
  constructor(@Optional() @Host() public popover: SatPopover) {}

  ngOnInit() {
    if (this.popover) {
      this.popover.closed
        .pipe(filter(val => val == null))
        .subscribe(() => (this.comment = this.value || null));
    }
  }

  onSubmit() {
    if (this.popover) {
      this.popover.close(this.serial_no);
    }
  }
  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
