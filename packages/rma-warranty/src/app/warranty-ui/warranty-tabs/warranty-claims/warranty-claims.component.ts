import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WarrantyService } from '../warranty.service';
import { WARRANTY_CLAIM } from '../../../constants/storage';
import {
  WarrantyClaimsDataSource,
  WarrantyClaimsListingData,
} from './warranty-claims.datasource';

@Component({
  selector: 'warranty-claims',
  templateUrl: './warranty-claims.component.html',
  styleUrls: ['./warranty-claims.component.scss'],
})
export class WarrantyClaimsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: WarrantyClaimsDataSource;
  claim: string;
  selectedClaimDataSource = [];
  selectedClaimColumns = ['company', 'supplier', 'serial_no', 'item'];
  displayedColumns = ['claim', 'company', 'supplier', 'date', 'items'];
  model: string;
  search: string = '';
  supplier: string;
  company: string;

  constructor(private warrantyService: WarrantyService) {}

  ngOnInit() {
    this.model = WARRANTY_CLAIM;
    this.dataSource = new WarrantyClaimsDataSource(
      this.model,
      this.warrantyService,
    );
    this.dataSource.loadItems();
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }

  updateItem(row: WarrantyClaimsListingData) {
    this.supplier = row.supplier;
    this.company = row.company;
    this.claim = row.claim;
    this.selectedClaimDataSource = row.items;
  }
}
