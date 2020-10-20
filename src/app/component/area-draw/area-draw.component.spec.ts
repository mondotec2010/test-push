import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDrawComponent } from './area-draw.component';

describe('AreaDrawComponent', () => {
  let component: AreaDrawComponent;
  let fixture: ComponentFixture<AreaDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
