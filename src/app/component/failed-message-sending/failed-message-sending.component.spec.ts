import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedMessageSendingComponent } from './failed-message-sending.component';

describe('FailedMessageSendingComponent', () => {
  let component: FailedMessageSendingComponent;
  let fixture: ComponentFixture<FailedMessageSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedMessageSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedMessageSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
