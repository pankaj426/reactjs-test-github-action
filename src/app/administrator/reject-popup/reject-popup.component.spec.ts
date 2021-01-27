import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PomoationLinkPopupComponent } from './reject-popup.component';

describe('PomoationLinkPopupComponent', () => {
  let component: PomoationLinkPopupComponent;
  let fixture: ComponentFixture<PomoationLinkPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PomoationLinkPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PomoationLinkPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
