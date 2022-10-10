import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProblemService } from '../services/problem/problem.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.page.html',
  styleUrls: ['./add-problem.page.scss'],
})
export class AddProblemPage implements OnInit {
  @Input() passedFrom: string = '';
  @Input() uuid?: string = '';
  problemFormControl = new FormControl('', Validators.required);
  disableAction: boolean = true;
  constructor(
    private readonly problemService: ProblemService,
    private readonly popoverCtrl: PopoverController,
  ) {}

  ngOnInit() {
    this.problemFormControl.valueChanges.subscribe(value => {
      if (value !== '') this.disableAction = false;
      else this.disableAction = true;
    });
    if (this.passedFrom === 'update') this.getProblem();
  }

  getProblem() {
    this.problemService.getProblem(this.uuid).subscribe({
      next: res => {
        this.problemFormControl.setValue(res.problem_name);
      },
    });
  }

  addProblem() {
    this.problemService.addProblem(this.problemFormControl.value).subscribe({
      next: res => {
        this.popoverCtrl.dismiss({
          success: true,
        });
      },
    });
  }

  onCancel() {
    this.popoverCtrl.dismiss({
      success: false,
    });
  }

  updateProblem() {
    this.problemService
      .updateProblem(this.problemFormControl.value, this.uuid)
      .subscribe({
        next: res => {
          this.popoverCtrl.dismiss({
            success: true,
          });
        },
      });
  }
}
