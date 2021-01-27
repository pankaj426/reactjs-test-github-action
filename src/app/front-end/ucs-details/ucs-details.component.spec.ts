import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UcsDetailsComponent } from './ucs-details.component';

describe('UcsDetailsComponent', () => {
  let component: UcsDetailsComponent;
  let fixture: ComponentFixture<UcsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UcsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UcsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
