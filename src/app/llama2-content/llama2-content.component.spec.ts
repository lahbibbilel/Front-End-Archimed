import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Llama2ContentComponent } from './llama2-content.component';

describe('Llama2ContentComponent', () => {
  let component: Llama2ContentComponent;
  let fixture: ComponentFixture<Llama2ContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Llama2ContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Llama2ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
