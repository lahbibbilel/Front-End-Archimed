import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJSComponent } from './chat-js.component';

describe('ChatJSComponent', () => {
  let component: ChatJSComponent;
  let fixture: ComponentFixture<ChatJSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatJSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
