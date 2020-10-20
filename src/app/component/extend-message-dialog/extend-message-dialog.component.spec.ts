import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendMessageDialogComponent } from './extend-message-dialog.component';

describe('ExtendMessageDialogComponent', () => {
  let component: ExtendMessageDialogComponent;
  let fixture: ComponentFixture<ExtendMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
