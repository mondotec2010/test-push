import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasFactoryComponent } from './areas-factory.component';

describe('AreasFactoryComponent', () => {
  let component: AreasFactoryComponent;
  let fixture: ComponentFixture<AreasFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
