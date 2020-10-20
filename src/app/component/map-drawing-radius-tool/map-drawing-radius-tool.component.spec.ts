import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDrawingRadiusToolComponent } from './map-drawing-radius-tool.component';

describe('MapDrawingRadiusToolComponent', () => {
  let component: MapDrawingRadiusToolComponent;
  let fixture: ComponentFixture<MapDrawingRadiusToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDrawingRadiusToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDrawingRadiusToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
