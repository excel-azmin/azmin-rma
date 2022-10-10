import { Component, OnInit, Input, Host, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators';
// import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss'],
})
export class EditTableComponent implements OnInit {
  @Input()
  get value(): any {
    return this._value;
  }
  set value(x) {
    this._value = x;
    // this.itemFormControl.setValue({ serial_no: x });
    this.serial_no = x;
  }

  private _value = '';
  itemFormControl = new FormControl();
  filteredItemList: Observable<any[]>;
  comment = '';
  serial_no: string = '';
  constructor(
    @Optional() @Host() public popover: SatPopover, // private salesService: SalesService,
  ) {}

  ngOnInit() {
    if (this.popover) {
      this.popover.closed
        .pipe(filter(val => val == null))
        .subscribe(() => (this.comment = this.value || null));
    }
  }

  // getSerialList() {
  //   this.filteredItemList = this.itemFormControl.valueChanges.pipe(
  //     startWith(''),
  //     switchMap(value => {
  //       return this.salesService.getSerialList(value);
  //     }),
  //   );
  // }

  // getOptionText(option) {
  //   return option.serial_no;
  // }

  onSubmit() {
    if (this.popover) {
      // const selectedSerial = {} as { serial_no: string; supplier: string };
      // selectedSerial.serial_no = this.itemFormControl.value.serial_no;
      // selectedSerial.supplier = this.itemFormControl.value.supplier;
      this.popover.close(this.serial_no);
    }
  }
  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
