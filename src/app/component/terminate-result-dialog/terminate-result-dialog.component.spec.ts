import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateResultDialogComponent } from './terminate-result-dialog.component';

describe('TerminateResultDialogComponent', () => {
  let component: TerminateResultDialogComponent;
  let fixture: ComponentFixture<TerminateResultDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateResultDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
