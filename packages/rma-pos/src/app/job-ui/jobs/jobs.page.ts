import { Component, OnInit, ViewChild } from '@angular/core';
import { JobsService } from '../jobs-service/jobs.service';
import { JobsDataSource } from './jobs-datasource';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ViewSingleJobPage } from '../view-single-job/view-single-job.page';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import { CLOSE } from '../../constants/app-string';
import { LoadingController } from '@ionic/angular';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = [
    'parent',
    'failCount',
    'serials',
    'status',
    'type',
  ];
  dataSource: JobsDataSource;
  sort: string = '';
  index: number = 0;
  size: number = 10;
  parent: string;
  status: string = 'Failed';
  permissionState = PERMISSION_STATE;
  jobStatus = [
    'Successful',
    'Failed',
    'Exported',
    'In Queue',
    'Reset',
    'All',
    'Retrying',
  ];
  openJobDetails = ['Failed', 'Exported', 'In Queue'];
  constructor(
    private readonly jobsService: JobsService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly loadingController: LoadingController,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.dataSource = new JobsDataSource(this.jobsService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => {
          if (event.url.includes('/jobs')) {
            return event;
          }
          return false;
        }),
      )
      .subscribe({
        next: res => {
          if (res) {
            this.parent = this.route.snapshot.queryParams.parent;
            this.status = 'All';
            this.setFilter();
          }
        },
        error: err => {},
      });
  }
  getUpdate(event) {
    this.index = event.pageIndex;
    this.size = event.pageSize;
    this.setFilter(event);
  }

  navigateBack() {
    this.location.back();
  }

  async viewSingleJob(row) {
    if (this.openJobDetails.includes(row.data.status)) {
      const dialogRef = this.dialog.open(ViewSingleJobPage, {
        width: '50%',
        height: '50%',
        data: row,
      });
      const response = await dialogRef.afterClosed().toPromise();
      if (response) {
        this.setFilter();
      }
    }
    return;
  }

  getSerialValue(element: JobItem) {
    const serials = [];
    if (!element.items) {
      return `Data Import Job`;
    }
    element.items.forEach(item => {
      if (item.has_serial_no === 0) {
        return;
      }
      if (item.serial_no) {
        if (typeof item.serial_no === 'string') {
          serials.push(...item.serial_no.split('\n'));
        } else {
          serials.push(...item.serial_no);
        }
      }
    });
    if (serials.length) {
      return `${serials[0]} - ${serials[serials.length - 1]}`;
    }
    return `Non serial Item`;
  }

  getCamelCase(value: string) {
    return _.camelCase(value.replace('_', ' '));
  }

  getPurchaseSerialValue(element: JobItem[]) {
    const serials = [];
    element.forEach(job => {
      job.items.forEach(item => {
        if (item.has_serial_no === 0) {
          return;
        }
        if (item.serial_no) {
          if (typeof item.serial_no === 'string') {
            serials.push(...item.serial_no.split('\n'));
          } else {
            serials.push(...item.serial_no);
          }
        }
      });
    });
    if (serials.length) {
      return `${serials[0]} - ${serials[serials.length - 1]}`;
    }
    return `Non serial Item`;
  }

  setFilter(event?) {
    const query: any = {};
    this.status !== 'All' ? (query['data.status'] = this.status) : null;
    this.parent ? (query['data.parent'] = { $regex: this.parent }) : null;
    let sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }

    sortQuery = Object.keys(sortQuery).length === 0 ? undefined : sortQuery;

    this.index, (this.paginator.pageIndex = event?.pageIndex || 0);
    this.size, (this.paginator.pageSize = event?.pageSize || 30);
    this.dataSource.loadItems(
      sortQuery,
      event?.pageIndex || undefined,
      event?.pageSize || undefined,
      query,
    );
  }

  statusChange(status) {
    if (status === 'All') {
      this.dataSource.loadItems();
    } else {
      this.status = status;
      this.setFilter();
    }
  }

  async deleteEmptyJobs() {
    const loading = await this.loadingController.create({
      message: `Syncing ${this.dataSource.data.length} items, this may take a while...!`,
    });
    await loading.present();
    return this.jobsService.deleteEmptyJobs(this.dataSource.data).subscribe({
      next: success => {
        loading.dismiss();
        this.setFilter();
        this.snackBar.open('Items successfully synced.', CLOSE, {
          duration: 4500,
        });
      },
      error: err => {
        loading.dismiss();
        this.snackBar.open(
          `Failed to sync items: ${err?.error?.message || ''}`,
          CLOSE,
          { duration: 4500 },
        );
      },
    });
  }
}

export class JobItem {
  items: { serial_no: any; has_serial_no: number }[];
}
