import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UscDetailsSidebarComponent } from './usc-details-sidebar.component';

describe('UscDetailsSidebarComponent', () => {
  let component: UscDetailsSidebarComponent;
  let fixture: ComponentFixture<UscDetailsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UscDetailsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UscDetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
