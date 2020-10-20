import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListComponent } from './delete-list.component';

describe('DeleteListComponent', () => {
  let component: DeleteListComponent;
  let fixture: ComponentFixture<DeleteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
