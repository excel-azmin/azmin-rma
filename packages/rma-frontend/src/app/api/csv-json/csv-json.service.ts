import { Component, Inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { of, from, throwError } from 'rxjs';
import * as CSVTOJSON from 'csvjson-csv2json';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CLOSE,
  DELIVERY_NOTE,
  PURCHASE_RECEIPT,
} from '../../constants/app-string';
import {
  switchMap,
  map,
  concatMap,
  catchError,
  toArray,
  bufferCount,
} from 'rxjs/operators';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  VALIDATE_SERIAL_BUFFER_COUNT,
} from '../../constants/storage';
import { StorageService } from '../storage/storage.service';
import {
  AssignSerialsDialog,
  CsvJsonObj,
} from '../../sales-ui/view-sales-invoice/serials/serials.component';
import { SalesService } from '../../sales-ui/services/sales.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CsvJsonService {
  arrayBuffer;
  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private storage: StorageService,
    private readonly salesService: SalesService,
  ) {}

  // give a file buffer from file-input as event.target.files[0]

  csvToJSON(csvPayload) {
    return of(CSVTOJSON.csv2json(csvPayload, { parseNumbers: false }));
  }

  validateHeaders(licenseHeaders: string[]) {
    const notFound = _.differenceWith(licenseHeaders, FILE_HEADERS, _.isEqual)
      .length;
    if (notFound) {
      this.snackBar.open(
        `Invalid header,expected ${FILE_HEADERS.join(
          ', ',
        )} found ${licenseHeaders.join(', ')} please add them to 1st row.`,
        CLOSE,
        { duration: 4500 },
      );
      return false;
    }
    return true;
  }

  mapJson(jsonData: { item_name: string; serial_no: string }[]) {
    const out = {};
    _.forEach(jsonData, element => {
      if (out[element.item_name]) {
        out[element.item_name].serial_no.push(
          element.serial_no.toString().toUpperCase(),
        );
      } else {
        out[element.item_name] = {
          serial_no: [element.serial_no.toString().toUpperCase()],
        };
      }
    });
    return out;
  }

  validateReturnSerials(
    item_names: string[],
    itemObj: CsvJsonObj,
    delivery_note_names: string[],
    warehouse: string,
  ) {
    return this.salesService.getItemByItemNames(item_names).pipe(
      switchMap((response: any[]) => {
        if (response.length === item_names.length) {
          return this.validateReturnSerialsWithItem(
            itemObj,
            delivery_note_names,
            warehouse,
          ).pipe(
            switchMap(isValid => {
              if (isValid.length) {
                this.snackBar.open(
                  `${isValid.length} Invalid Serials: ${isValid
                    .splice(0, 50)
                    .join(', ')}`,
                  CLOSE,
                  { duration: 4500 },
                );
                return of(false);
              }
              return of(true);
            }),
          );
        }
        this.snackBar.open(
          `Item not found :
              ${_.differenceWith(
                item_names,
                response.map(element => {
                  return item_names.includes(element.item_name)
                    ? element.item_name
                    : undefined;
                }),
                _.isEqual,
              ).join(', ')}`,
          CLOSE,
          { duration: 4500 },
        );
        return of(false);
      }),
    );
  }

  validateSerials(
    item_names: string[],
    itemObj: CsvJsonObj,
    validateFor?: string,
    warehouse?: string,
  ) {
    return this.salesService.getItemByItemNames(item_names).pipe(
      switchMap((response: any[]) => {
        if (response.length === item_names.length) {
          return validateFor === PURCHASE_RECEIPT
            ? this.validateIfSerialExists(itemObj, validateFor)
            : this.validateSerialsWithItem(itemObj, validateFor, warehouse);
        }
        this.itemNotFound(response, item_names);
        return of(false);
      }),
      toArray(),
      switchMap(success => {
        return of(true);
      }),
      catchError(err => {
        if (err && err.error && err.error.message) {
          this.snackBar.open(err.error.message, CLOSE, { duration: 4500 });
        } else {
          this.snackBar.open(
            `Found ${
              validateFor === PURCHASE_RECEIPT ? `${err.length}+` : ''
            } Invalid Serials: ${err.splice(0, 50).join(', ')}..`,
            CLOSE,
            { duration: 4500 },
          );
        }
        return of(false);
      }),
    );
  }

  itemNotFound(items, item_names: string[]) {
    this.snackBar.open(
      `Item not found :
          ${_.differenceWith(
            item_names,
            items.map(element => {
              return item_names.includes(element.item_name)
                ? element.item_name
                : undefined;
            }),
            _.isEqual,
          ).join(', ')}`,
      CLOSE,
      { duration: 4500 },
    );
  }

  validateSerialsWithItem(
    itemObj: CsvJsonObj,
    validateFor?: string,
    warehouse?: string,
  ) {
    const invalidSerials = [];
    return from(Object.keys(itemObj)).pipe(
      switchMap(key => {
        return from(itemObj[key].serial_no).pipe(
          bufferCount(VALIDATE_SERIAL_BUFFER_COUNT),
          concatMap((serialBatch: string[]) => {
            return this.salesService.validateSerials({
              item_code: key,
              serials: serialBatch,
              validateFor,
              warehouse,
            });
          }),
          switchMap((data: { notFoundSerials: string[] }) => {
            invalidSerials.push(...data.notFoundSerials);
            if (invalidSerials.length) {
              return throwError(invalidSerials);
            }
            return of(true);
          }),
        );
      }),
    );
  }

  validateReturnSerialsWithItem(
    itemObj: CsvJsonObj,
    delivery_note_names,
    warehouse,
  ) {
    const invalidSerials = [];
    return from(Object.keys(itemObj)).pipe(
      switchMap(key => {
        return this.salesService
          .validateReturnSerials({
            item_code: key,
            serials: itemObj[key].serial_no,
            delivery_note_names,
            warehouse,
          })
          .pipe(
            switchMap((data: { notFoundSerials: string[] }) => {
              invalidSerials.push(...data.notFoundSerials);
              return of(invalidSerials);
            }),
          );
      }),
    );
  }

  validateIfSerialExists(itemObj: CsvJsonObj, validateFor?: string) {
    const invalidSerials = [];
    let serials = [];
    Object.keys(itemObj).forEach(item => {
      serials = _.concat(serials, itemObj[item].serial_no);
    });
    validateFor = validateFor ? validateFor : DELIVERY_NOTE;
    return from(serials).pipe(
      bufferCount(VALIDATE_SERIAL_BUFFER_COUNT),
      concatMap((serialBatch: string[]) => {
        return this.salesService.validateSerials({
          item_code: '',
          serials: serialBatch,
          validateFor,
        });
      }),
      switchMap((data: { notFoundSerials: string[] }) => {
        invalidSerials.push(...data.notFoundSerials);
        if (invalidSerials.length) {
          return throwError(invalidSerials);
        }
        return of(true);
      }),
    );
  }

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => {
        return {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
        };
      }),
    );
  }

  async downloadAsCSV(data: any[], fields: string[], filename) {
    const parsedFields = {};
    Object.keys(data[0]).forEach(key => {
      parsedFields[key] = false;
      if (fields.includes(key)) {
        parsedFields[key] = true;
      }
      if (!['string', 'number'].includes(typeof data[0][key])) {
        delete parsedFields[key];
      }
    });

    const dialogRef = this.dialog.open(SelectDumpHeadersDialog, {
      width: '250px',
      data: parsedFields,
    });

    let selectedFields = await dialogRef.afterClosed().toPromise();
    if (!selectedFields) {
      return;
    }
    selectedFields = Object.keys(selectedFields).filter(key => {
      if (selectedFields[key]) {
        return key;
      }
    });

    let csv: any = data.map(function (row) {
      return selectedFields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], (key, value) => {
            return value === null ? '' : value;
          });
        })
        .join(',');
    });
    csv.unshift(selectedFields.join(',')); // add header column
    csv = csv.join('\r\n');
    return this.downloadFile(csv, filename);
  }

  async downloadStockAvailabilityCSV(data: any[], fields: string[], filename) {
    const parsedFields = {};
    Object.keys(data[0]).forEach(key => {
      parsedFields[key] = false;
      if (fields.includes(key)) {
        parsedFields[key] = true;
      }
      if (!['string', 'number'].includes(typeof data[0][key])) {
        delete parsedFields[key];
      }
    });

    const dialogRef = this.dialog.open(SelectDumpHeadersDialog, {
      width: '250px',
      data: parsedFields,
    });

    let selectedFields = await dialogRef.afterClosed().toPromise();
    if (!selectedFields) {
      return;
    }
    selectedFields = Object.keys(selectedFields).filter(key => {
      if (selectedFields[key]) {
        return key;
      }
    });

    let csv: any = data.map(function (row) {
      return selectedFields
        .map(function (fieldName) {
          return JSON.stringify(row[fieldName], (key, value) => {
            return value === null ? '' : value;
          });
        })
        .join(',');
    });
    csv.unshift(selectedFields.join(',')); // add header column
    csv = csv.join('\r\n');
    return this.downloadFile(csv, filename);
  }

  downloadFile(data: any, filename) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

export const FILE_HEADERS = ['item_name', 'serial_no'];

@Component({
  selector: 'select-dump-headers-dialog',
  templateUrl: 'select-dump-headers-dialog.html',
  styles: ['./select-dump-headers-dialog.scss'],
})
export class SelectDumpHeadersDialog {
  keys = [];
  constructor(
    public dialogRef: MatDialogRef<AssignSerialsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.keys = Object.keys(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  parsedTitle(title) {
    return title
      .split('_')
      .filter(element => {
        return element.charAt(0).toUpperCase() + element.slice(1);
      })
      .join(' ');
  }
}
