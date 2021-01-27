import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupApplicationFormComponent } from './startup-application-form.component';

describe('StartupApplicationFormComponent', () => {
  let component: StartupApplicationFormComponent;
  let fixture: ComponentFixture<StartupApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartupApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartupApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
