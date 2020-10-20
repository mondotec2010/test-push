import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSentMessageErrorComponent } from './dialog-sent-message-error.component';

describe('DialogSentMessageErrorComponent', () => {
  let component: DialogSentMessageErrorComponent;
  let fixture: ComponentFixture<DialogSentMessageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSentMessageErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSentMessageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
