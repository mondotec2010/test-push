import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateMessageDialogComponent } from './terminate-message-dialog.component';

describe('TerminateMessageDialogComponent', () => {
  let component: TerminateMessageDialogComponent;
  let fixture: ComponentFixture<TerminateMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminateMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
