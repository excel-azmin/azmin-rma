import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';

import { AddProblemPage } from './add-problem.page';
import { ProblemService } from '../services/problem/problem.service';
import { of } from 'rxjs';

describe('AddProblemPage', () => {
  let component: AddProblemPage;
  let fixture: ComponentFixture<AddProblemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddProblemPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: ProblemService,
          useValue: {
            getProblem: (...args) => of({ problem_name: '' }),
          },
        },
        { provide: PopoverController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProblemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
