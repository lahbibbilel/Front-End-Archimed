import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudUsersContentComponent } from './crud-users-content.component';

describe('CrudUsersContentComponent', () => {
  let component: CrudUsersContentComponent;
  let fixture: ComponentFixture<CrudUsersContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudUsersContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudUsersContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
