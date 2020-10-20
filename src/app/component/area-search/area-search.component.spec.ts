import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSearchComponent } from './area-search.component';

describe('AreaSearchComponent', () => {
  let component: AreaSearchComponent;
  let fixture: ComponentFixture<AreaSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
