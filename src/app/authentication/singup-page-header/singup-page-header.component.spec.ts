import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingupPageHeaderComponent } from './singup-page-header.component';

describe('SingupPageHeaderComponent', () => {
  let component: SingupPageHeaderComponent;
  let fixture: ComponentFixture<SingupPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingupPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingupPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
