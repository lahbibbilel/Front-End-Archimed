import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterAndCleanSqlToXmlCsvComponent } from './converter-and-clean-sql-to-xml-csv.component';

describe('ConverterAndCleanSqlToXmlCsvComponent', () => {
  let component: ConverterAndCleanSqlToXmlCsvComponent;
  let fixture: ComponentFixture<ConverterAndCleanSqlToXmlCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverterAndCleanSqlToXmlCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConverterAndCleanSqlToXmlCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
