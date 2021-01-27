import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUcsComponent } from './edit-ucs.component';

describe('EditUcsComponent', () => {
  let component: EditUcsComponent;
  let fixture: ComponentFixture<EditUcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
