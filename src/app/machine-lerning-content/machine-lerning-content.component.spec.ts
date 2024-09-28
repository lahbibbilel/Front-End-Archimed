import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineLerningContentComponent } from './machine-lerning-content.component';

describe('MachineLerningContentComponent', () => {
  let component: MachineLerningContentComponent;
  let fixture: ComponentFixture<MachineLerningContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineLerningContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLerningContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
