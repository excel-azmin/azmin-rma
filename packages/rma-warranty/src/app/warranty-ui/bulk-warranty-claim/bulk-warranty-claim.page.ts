import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { WarrantyService } from '../warranty-tabs/warranty.service';
import { WarrantyClaimsDataSource } from '../warranty/warranty-claims-datasource';

@Component({
  selector: 'app-bulk-warranty-claim',
  templateUrl: './bulk-warranty-claim.page.html',
  styleUrls: ['./bulk-warranty-claim.page.scss'],
})
export class BulkWarrantyClaimPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: WarrantyClaimsDataSource;
  claim_no: string = this.route.snapshot.params.name;

  constructor(
    private readonly location: Location,
    private route: ActivatedRoute,
    private warrantyService: WarrantyService,
  ) {}

  selectedSegment: any;

  ngOnInit() {
    this.selectedSegment = 0;
    this.dataSource = new WarrantyClaimsDataSource(this.warrantyService);
  }

  getUpdate(event) {
    const query: any = {};
    this.paginator.pageIndex = event?.pageIndex || 0;
    this.paginator.pageSize = event?.pageSize || 30;

    this.dataSource.loadItems(
      {},
      this.paginator.pageIndex,
      this.paginator.pageSize,
      { parent: this.route.snapshot.params?.uuid, ...query },
      {
        set: ['Part'],
      },
    );
  }

  navigateBack() {
    this.location.back();
  }
}
