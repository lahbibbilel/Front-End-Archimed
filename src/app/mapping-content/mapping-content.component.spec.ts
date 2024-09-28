import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingContentComponent } from './mapping-content.component';

describe('MappingContentComponent', () => {
  let component: MappingContentComponent;
  let fixture: ComponentFixture<MappingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
