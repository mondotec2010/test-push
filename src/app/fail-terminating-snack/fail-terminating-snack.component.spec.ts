import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailTerminatingSnackComponent } from './fail-terminating-snack.component';

describe('FailTerminatingSnackComponent', () => {
  let component: FailTerminatingSnackComponent;
  let fixture: ComponentFixture<FailTerminatingSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailTerminatingSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailTerminatingSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
