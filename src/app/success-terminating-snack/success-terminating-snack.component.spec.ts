import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessTerminatingSnackComponent } from './success-terminating-snack.component';

describe('SuccessTerminatingSnackComponent', () => {
  let component: SuccessTerminatingSnackComponent;
  let fixture: ComponentFixture<SuccessTerminatingSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessTerminatingSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessTerminatingSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
