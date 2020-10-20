import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessMessageSendingComponent } from './success-message-sending.component';

describe('SuccessMessageSendingComponent', () => {
  let component: SuccessMessageSendingComponent;
  let fixture: ComponentFixture<SuccessMessageSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessMessageSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessMessageSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
