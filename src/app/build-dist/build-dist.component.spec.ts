import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDistComponent } from './build-dist.component';

describe('BuildDistComponent', () => {
  let component: BuildDistComponent;
  let fixture: ComponentFixture<BuildDistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildDistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
