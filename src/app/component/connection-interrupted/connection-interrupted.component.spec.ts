import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionInterruptedComponent } from './connection-interrupted.component';

describe('ConnectionInterruptedComponent', () => {
  let component: ConnectionInterruptedComponent;
  let fixture: ComponentFixture<ConnectionInterruptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionInterruptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionInterruptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
