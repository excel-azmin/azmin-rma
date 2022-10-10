import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobsService } from '../jobs-service/jobs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from '../../constants/app-string';

export class JobInterface {
  _id: string;
  name: string;
  failedAt: string;
  failCount: string;
  failReason: string;
  data: {
    status: string;
    parent: string;
    payload: any;
    token: {
      fullName: string;
    };
    sales_invoice_name: string;
    uuid: string;
    type: string;
  };
}

@Component({
  selector: 'app-view-single-job',
  templateUrl: './view-single-job.page.html',
  styleUrls: ['./view-single-job.page.scss'],
})
export class ViewSingleJobPage {
  state = {
    retry: false,
    reset: false,
    sync: false,
  };
  message: string;
  AGENDA_JOB_STATUS = {
    success: 'Successful',
    fail: 'Failed',
    in_queue: 'In Queue',
    reset: 'Reset',
    retrying: 'Retrying',
    exported: 'Exported',
  };
  failedJobStatus = ['Failed', 'Retrying'];

  constructor(
    public dialogRef: MatDialogRef<ViewSingleJobPage>,
    @Inject(MAT_DIALOG_DATA) public data: JobInterface,
    private readonly jobService: JobsService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.getMessage();
  }

  getMessage() {
    if (
      this.data &&
      this.data.data &&
      this.data.data.status === this.AGENDA_JOB_STATUS.exported
    ) {
      this.state.retry = false;
      this.state.reset = false;
      this.state.sync = true;
      this.message = `
      Following job is exported and will be synced once completed on the main app.
      If job is stale from long time then try to sync.
      `;
      return;
    }
    if (this.data && this.data.failReason) {
      this.state.retry = true;
      this.state.sync = true;
      this.state.reset = true;
      this.message = JSON.stringify(this.data.failReason);
    }
  }

  resetJob() {
    this.jobService.resetJob(this.data._id).subscribe({
      next: success => {
        this.snackBar.open('Job Reset Successfully.', CLOSE, {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: err => {
        this.snackBar.open(err.error.message, CLOSE, { duration: 4500 });
      },
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  retryJob() {
    this.jobService.retryJob(this.data._id).subscribe({
      next: success => {
        this.snackBar.open('Job Requeued Successfully.', CLOSE, {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: err => {
        this.snackBar.open('Fail to retry job: ' + err.message, CLOSE, {
          duration: 2500,
        });
      },
    });
  }

  syncJob() {
    this.jobService.syncJob(this.data._id).subscribe({
      next: (success: any) => {
        this.snackBar.open(
          success.message || 'Job Synced successfully.',
          CLOSE,
          {
            duration: 3000,
          },
        );
        this.dialogRef.close(true);
      },
      error: err => {
        this.snackBar.open('Fail to Sync job: ' + err?.error?.message, CLOSE, {
          duration: 2500,
        });
      },
    });
  }
}
