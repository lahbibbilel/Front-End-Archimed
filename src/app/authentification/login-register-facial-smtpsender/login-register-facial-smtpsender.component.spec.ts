import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterFacialSmtpsenderComponent } from './login-register-facial-smtpsender.component';

describe('LoginRegisterFacialSmtpsenderComponent', () => {
  let component: LoginRegisterFacialSmtpsenderComponent;
  let fixture: ComponentFixture<LoginRegisterFacialSmtpsenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRegisterFacialSmtpsenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterFacialSmtpsenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
