import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { StockBalanceSummaryDataSource } from './stock-balance-summary-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { StockBalanceSummaryService } from './services/stock-balance-summary/stock-balance-summary.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DURATION } from '../constants/app-string';

@Component({
  selector: 'app-stock-balance-summary',
  templateUrl: './stock-balance-summary.page.html',
  styleUrls: ['./stock-balance-summary.page.scss'],
})
export class StockBalanceSummaryPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: StockBalanceSummaryDataSource;
  displayedColumns = ['sr_no', 'item_code', 'total_inward', 'total_outward'];
  search: any;
  range = new FormGroup({
    start_date: new FormControl([Validators.required]),
    end_date: new FormControl([Validators.required]),
  });
  constructor(
    private location: Location,
    private snackBar: MatSnackBar,
    private readonly stockBalanceSummaryService: StockBalanceSummaryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.search = '';
    this.dataSource = new StockBalanceSummaryDataSource(
      this.stockBalanceSummaryService,
    );
    if (this.range.hasError) {
      this.snackBar.open(
        'Please select dates to get stock summary records',
        'Close',
        { duration: DURATION },
      );
    }
  }

  navigateBack() {
    this.location.back();
  }

  setFilter(event?) {
    this.search = JSON.stringify({
      start_date: this.range.controls.start_date.value,
      end_date: this.range.controls.end_date.value,
    });
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      event?.pageIndex || 0,
      event?.pageSize || 30,
    );
  }
}
