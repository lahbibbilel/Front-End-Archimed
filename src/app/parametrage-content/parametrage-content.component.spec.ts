import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageContentComponent } from './parametrage-content.component';

describe('TypographyComponent', () => {
  let component: ParametrageContentComponent;
  let fixture: ComponentFixture<ParametrageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
