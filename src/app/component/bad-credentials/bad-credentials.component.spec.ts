import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadCredentialsComponent } from './bad-credentials.component';

describe('BadCredentialsComponent', () => {
  let component: BadCredentialsComponent;
  let fixture: ComponentFixture<BadCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
