import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WarrantyClaimsDetails } from '../../common/interfaces/warranty.interface';
import { ViewWarrantyService } from './view-warranty.service';
@Component({
  selector: 'view-warranty-claims',
  templateUrl: './view-warranty-claims.page.html',
  styleUrls: ['./view-warranty-claims.page.scss'],
})
export class ViewWarrantyClaimsPage implements OnInit {
  selectedSegment: any;
  warrantyDetail: WarrantyClaimsDetails;
  constructor(
    private readonly location: Location,
    private readonly activatedRoute: ActivatedRoute,
    private readonly viewWarrantyService: ViewWarrantyService,
  ) {}

  ngOnInit() {
    this.selectedSegment = 0;
    this.viewWarrantyService
      .getWarrantyDetail(this.activatedRoute.snapshot.params.uuid)
      .subscribe({
        next: res => {
          this.warrantyDetail = res;
        },
        error: err => {},
      });
  }
  navigateBack() {
    this.location.back();
  }
}
