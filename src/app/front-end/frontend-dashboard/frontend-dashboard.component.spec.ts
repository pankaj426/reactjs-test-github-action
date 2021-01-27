import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendDashboardComponent } from './frontend-dashboard.component';

describe('FrontendDashboardComponent', () => {
  let component: FrontendDashboardComponent;
  let fixture: ComponentFixture<FrontendDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
