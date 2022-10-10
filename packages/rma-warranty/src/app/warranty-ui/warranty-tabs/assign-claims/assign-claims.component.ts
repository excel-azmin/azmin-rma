import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'warranty-assign-claims',
  templateUrl: './assign-claims.component.html',
  styleUrls: ['./assign-claims.component.scss'],
})
export class AssignClaimsComponent implements OnInit {
  date;
  csvFile: any;
  displayedColumns: string[] = [
    'position',
    'serial',
    'item',
    'company',
    'supplier',
    'claimsReceivedDate',
  ];
  dataSource = [];
  company;
  supplier;

  constructor(private readonly snackbar: MatSnackBar) {}

  ngOnInit() {
    this.date = new Date().toDateString();
  }

  fileChangedEvent($event): void {
    const reader = new FileReader();
    reader.readAsText($event.target.files[0]);
    reader.onload = (file: any) => {
      this.csvFile = file.target.result;
      this.populateTable();
    };
  }

  populateTable() {
    if (!this.csvFile) return;
    this.dataSource = [];
    const data = this.csvJSON();
    let i = 0;
    data.forEach((element: { model: string; serial: string }) => {
      this.dataSource.push({
        position: i,
        serial: element.serial,
        item: element.model,
        company: this.company,
        supplier: this.supplier,
        claimsReceivedDate: this.date,
      });
      i++;
    });
  }

  csvJSON() {
    // don't try to optimize or work with this code this will fail to convert csv which have hidden characters such as ",; simply use
    // csvjson-csv2json library run the snippet npm i csvjson-csv2json
    // use it like CSVTOJSON.csv2json(YOUR_CSV_STRING, { parseNumbers: true });
    const lines = this.csvFile.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }

  createWarrantyClaims() {
    if (!this.supplier || !this.company) {
      this.snackbar.open('Please select a supplier and company', 'Close', {
        duration: 2500,
      });
      return;
    }
    this.snackbar.open('Warranty Claims Created', 'Close', { duration: 4500 });
  }
}
