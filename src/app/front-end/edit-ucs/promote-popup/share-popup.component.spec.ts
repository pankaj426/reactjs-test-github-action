import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotePopupComponent } from './promote-popup.component';

describe('PromotePopupComponent', () => {
  let component: PromotePopupComponent;
  let fixture: ComponentFixture<PromotePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
