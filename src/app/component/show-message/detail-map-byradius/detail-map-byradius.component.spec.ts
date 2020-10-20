import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMapByradiusComponent } from './detail-map-byradius.component';

describe('DetailMapByradiusComponent', () => {
  let component: DetailMapByradiusComponent;
  let fixture: ComponentFixture<DetailMapByradiusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMapByradiusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMapByradiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
