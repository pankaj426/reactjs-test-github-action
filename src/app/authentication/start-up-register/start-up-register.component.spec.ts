import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartUpRegisterComponent } from './start-up-register.component';

describe('StartUpRegisterComponent', () => {
  let component: StartUpRegisterComponent;
  let fixture: ComponentFixture<StartUpRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartUpRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartUpRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
