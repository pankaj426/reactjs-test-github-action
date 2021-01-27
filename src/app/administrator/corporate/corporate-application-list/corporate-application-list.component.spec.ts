import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateApplicationListComponent } from './corporate-application-list.component';

describe('CorporateApplicationListComponent', () => {
  let component: CorporateApplicationListComponent;
  let fixture: ComponentFixture<CorporateApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
