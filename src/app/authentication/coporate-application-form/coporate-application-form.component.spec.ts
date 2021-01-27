import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoporateApplicationFormComponent } from './coporate-application-form.component';

describe('CoporateApplicationFormComponent', () => {
  let component: CoporateApplicationFormComponent;
  let fixture: ComponentFixture<CoporateApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoporateApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoporateApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
