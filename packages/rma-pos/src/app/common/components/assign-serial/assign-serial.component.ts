import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CsvJsonService } from '../../../api/csv-json/csv-json.service';
import { CLOSE, DELIVERY_NOTE } from '../../../constants/app-string';
import {
  ItemDataSource,
  SerialDataSource,
} from '../../../sales-ui/view-sales-invoice/serials/serials-datasource';
import { CsvJsonObj } from '../../../sales-ui/view-sales-invoice/serials/serials.component';
import { SerialsService } from '../../helpers/serials/serials.service';

@Component({
  selector: 'app-assign-serial',
  templateUrl: './assign-serial.component.html',
  styleUrls: ['./assign-serial.component.scss'],
})
export class AssignSerialComponent implements OnInit {
  @ViewChild('csvFileInput', { static: false })
  csvFileInput: ElementRef;
  @Output() sendCSVJSON: EventEmitter<any> = new EventEmitter<any>();
  public sendCSVJSONDATA(response: any) {
    this.sendCSVJSON.emit(response);
  }
  @Output() sendPickerState: EventEmitter<any> = new EventEmitter<any>();
  public sendRangePickerState(response: any) {
    this.sendPickerState.emit(response);
  }
  @Input()
  state: any = {};

  @Input()
  rangePickerState = {
    prefix: '',
    fromRange: '',
    toRange: '',
    serials: [],
  };

  fromRangeUpdate = new Subject<string>();
  toRangeUpdate = new Subject<string>();
  value: string;
  date = new FormControl(new Date());
  itemDataSource: ItemDataSource;
  serialDataSource: SerialDataSource;
  remaining: number = 1;
  itemMap: any = {};

  constructor(
    private loadingController: LoadingController,
    private readonly csvService: CsvJsonService,
    private readonly serialsService: SerialsService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.serialDataSource = new SerialDataSource();
    this.itemDataSource = new ItemDataSource();
    this.onFromRange(this.value);
    this.onToRange(this.value);
  }

  async fileChangedEvent($event) {
    const loading = await this.loadingController.create({
      message: 'Fetching And validating serials for Purchase Receipt...!',
    });
    await loading.present();

    const reader = new FileReader();
    reader.readAsText($event.target.files[0]);
    reader.onload = (file: any) => {
      const csvData = file.target.result;
      const headers = csvData
        .split('\n')[0]
        .replace(/"/g, '')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .split(',');
      if (this.csvService.validateHeaders(headers)) {
        this.csvService
          .csvToJSON(csvData)
          .pipe(
            switchMap(json => {
              if (this.state.component === 'Material') {
                const data = this.csvService.mapJson(json);
                const material_item_names = [];
                const itemObj: CsvJsonObj = {};
                for (const key in data) {
                  if (key) {
                    material_item_names.push(key);
                    itemObj[key] = {
                      serial_no: data[key].serial_no.map(serial => {
                        return serial.toUpperCase();
                      }),
                    };
                  }
                }
                return of(itemObj);
              }
              const hashMap = this.csvService.mapJson(json);
              const item_names = Object.keys(hashMap);
              if (this.validateJson(hashMap)) {
                return this.csvService
                  .validateSerials(
                    item_names,
                    hashMap,
                    this.state.component,
                    this.state.warehouse,
                  )
                  .pipe(
                    switchMap((response: boolean) => {
                      this.csvFileInput.nativeElement.value = '';
                      if (response) {
                        this.getMessage('Serials Validated Successfully.');
                        return of(hashMap);
                      }
                      return of(false);
                    }),
                  );
              }
              return of(false);
            }),
          )
          .subscribe({
            next: (response: CsvJsonObj | boolean) => {
              loading.dismiss();
              if (response) {
                this.sendCSVJSONDATA(response);
              }
              this.csvFileInput.nativeElement.value = '';
            },
            error: err => {
              this.getMessage(
                'Error occurred while validation of serials : ' +
                  (err && err.error && err.error.message)
                  ? err.error.message
                  : '',
              );
              loading.dismiss();
              this.csvFileInput.nativeElement.value = '';
            },
          });
      } else {
        loading.dismiss();
        this.csvFileInput.nativeElement.value = '';
      }
    };
  }

  validateJson(hashMap: CsvJsonObj) {
    let isValid = true;
    const data = this.state.itemData;
    for (const value of data) {
      if (hashMap[value.item_name]) {
        if (value.remaining < hashMap[value.item_name].serial_no.length) {
          this.getMessage(`Item ${value.item_name} has
          ${value.remaining} remaining, but provided
          ${hashMap[value.item_name].serial_no.length} serials.`);
          isValid = false;
          break;
        }
        if (
          this.state.component === DELIVERY_NOTE &&
          value.item_code !== value.item_name
        ) {
          hashMap[value.item_code] = hashMap[value.item_name];
          delete hashMap[value.item_name];
        }
      }
    }
    return isValid;
  }

  getMessage(notFoundMessage, expected?, found?) {
    return this.snackBar.open(
      expected && found
        ? `${notFoundMessage}, expected ${expected} found ${found}`
        : `${notFoundMessage}`,
      CLOSE,
      { verticalPosition: 'top', duration: 2500 },
    );
  }

  onFromRange(value) {
    this.fromRangeUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(v => {
        this.generateSerials(value, this.rangePickerState.toRange);
      });
  }

  onToRange(value) {
    this.toRangeUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(v => {
        this.generateSerials(this.rangePickerState.fromRange, value);
      });
  }

  generateSerials(fromRange?, toRange?) {
    this.rangePickerState.serials =
      this.serialsService.getSerialsFromRange(
        fromRange || this.rangePickerState.fromRange || 0,
        toRange || this.rangePickerState.toRange || 0,
      ) || [];
    this.sendRangePickerState(this.rangePickerState);
  }
}
