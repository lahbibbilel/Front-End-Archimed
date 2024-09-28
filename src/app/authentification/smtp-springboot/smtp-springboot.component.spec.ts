import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpSpringbootComponent } from './smtp-springboot.component';

describe('SmtpSpringbootComponent', () => {
  let component: SmtpSpringbootComponent;
  let fixture: ComponentFixture<SmtpSpringbootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtpSpringbootComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmtpSpringbootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
