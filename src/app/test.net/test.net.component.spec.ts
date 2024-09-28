import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNetComponent } from './test.net.component';

describe('TestNetComponent', () => {
  let component: TestNetComponent;
  let fixture: ComponentFixture<TestNetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
