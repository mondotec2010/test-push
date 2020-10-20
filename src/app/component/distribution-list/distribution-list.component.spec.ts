import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionListComponent } from './distribution-list.component';

describe('DistributionListComponent', () => {
  let component: DistributionListComponent;
  let fixture: ComponentFixture<DistributionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
