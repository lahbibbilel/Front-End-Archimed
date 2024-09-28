import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFacialComponent } from './template-facial.component';

describe('TemplateFacialComponent', () => {
  let component: TemplateFacialComponent;
  let fixture: ComponentFixture<TemplateFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateFacialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
