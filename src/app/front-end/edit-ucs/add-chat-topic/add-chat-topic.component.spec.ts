import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatTopicComponent } from './add-chat-topic.component';

describe('AddChatTopicComponent', () => {
  let component: AddChatTopicComponent;
  let fixture: ComponentFixture<AddChatTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChatTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChatTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
