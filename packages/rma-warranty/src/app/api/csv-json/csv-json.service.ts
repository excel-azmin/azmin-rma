import { Component, Inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { of, from } from 'rxjs';
import * as CSVTOJSON from 'csvjson-csv2json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from '../../constants/app-string';
import { map } from 'rxjs/operators';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../constants/storage';
import { StorageService } from '../storage/storage.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AssignSerialsDialog } from '../../warranty-ui/warranty/warranty.page';

@Injectable({
  providedIn: 'root',
})
export class CsvJsonService {
  arrayBuffer;
  constructor(
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private storage: StorageService,
  ) {}

  // give a file buffer from file-input as event.target.files[0]

  csvToJSON(csvPayload) {
    return of(CSVTOJSON.csv2json(csvPayload, { parseNumbers: true }));
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
        return;
      }
      out[element.item_name] = {
        serial_no: [element.serial_no.toString().toUpperCase()],
      };
    });
    return out;
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
    Object.keys(Object.assign({}, ...data)).forEach(key => {
      parsedFields[key] = false;
      if (fields.includes(key)) {
        parsedFields[key] = true;
      }
      if (['object'].includes(typeof data[0][key])) {
        delete parsedFields[key];
      }
    });

    const dialogRef = this.dialog.open(SelectDumpHeadersDialog, {
      width: '250px',
      height: '70vh',
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
