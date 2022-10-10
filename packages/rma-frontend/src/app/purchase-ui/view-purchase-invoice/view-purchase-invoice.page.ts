import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseService } from '../services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PERMISSION_STATE } from '../../constants/permission-roles';

@Component({
  selector: 'app-view-purchase-invoice',
  templateUrl: './view-purchase-invoice.page.html',
  styleUrls: ['./view-purchase-invoice.page.scss'],
})
export class ViewPurchaseInvoicePage implements OnInit {
  selectedSegment: any;
  docstatus: number;
  invoiceUuid: string;
  invoiceName: string;
  permissionState = PERMISSION_STATE;

  constructor(
    private readonly location: Location,
    private router: Router,
    private readonly purchase: PurchaseService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.selectedSegment = 0;
    this.docstatus = 0;
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.purchase.getPurchaseInvoice(this.invoiceUuid).subscribe({
      next: res => {
        this.invoiceName = res.name;
        this.docstatus = res.docstatus;
      },
      error: error => {},
    });
  }

  navigateBack() {
    this.location.back();
  }

  showJobs() {
    this.router.navigateByUrl(`jobs?parent=${this.invoiceName}`);
  }
}
