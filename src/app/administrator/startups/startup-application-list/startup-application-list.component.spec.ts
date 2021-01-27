import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupApplicationListComponent } from './startup-application-list.component';

describe('StartupApplicationListComponent', () => {
  let component: StartupApplicationListComponent;
  let fixture: ComponentFixture<StartupApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartupApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartupApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
