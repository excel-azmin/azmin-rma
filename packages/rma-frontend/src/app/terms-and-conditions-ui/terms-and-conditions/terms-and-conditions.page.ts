import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AddTermsAndConditionsPage } from '../add-terms-and-conditions/add-terms-and-conditions.page';
import { TermsAndConditionsService } from '../services/TermsAndConditions/terms-and-conditions.service';
import { TermsAndConditionsDataSource } from './terms-and-conditions-datasource';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: TermsAndConditionsDataSource;
  displayedColumns = ['sr_no', 'terms_and_conditions_name', 'delete'];
  search: string;
  constructor(
    private location: Location,
    private readonly termsAndConditionsService: TermsAndConditionsService,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.search = '';
    this.dataSource = new TermsAndConditionsDataSource(
      this.termsAndConditionsService,
    );
    this.dataSource.loadItems();
  }

  navigateBack() {
    this.location.back();
  }

  async addTermsAndConditions() {
    const popover = await this.popoverController.create({
      component: AddTermsAndConditionsPage,
      componentProps: {
        passedFrom: 'add',
      },
    });

    await popover.present();
    popover.onDidDismiss().then(res => {
      if (res.data.success)
        this.dataSource.loadItems(
          this.search,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
        );
    });
  }

  async updateTermsAndConditions(uuid: string) {
    const popover = await this.popoverController.create({
      component: AddTermsAndConditionsPage,
      componentProps: {
        passedFrom: 'update',
        uuid,
      },
    });

    await popover.present();
    popover.onDidDismiss().then(res => {
      if (res.data.success)
        this.dataSource.loadItems(
          this.search,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
        );
    });
  }

  deleteTermsAndConditions(uuid: string) {
    this.termsAndConditionsService.deleteTermsAndConditions(uuid).subscribe({
      next: res => {
        this.dataSource.loadItems(
          this.search,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
        );
      },
    });
  }

  setFilter(event?) {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      event?.pageIndex || 0,
      event?.pageSize || 30,
    );
  }
}
