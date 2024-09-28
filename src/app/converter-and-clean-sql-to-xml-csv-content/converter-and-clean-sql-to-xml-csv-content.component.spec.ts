import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterAndCleanSqlToXmlCsvContentComponent } from './converter-and-clean-sql-to-xml-csv-content.component';

describe('ConverterAndCleanSqlToXmlCsvContentComponent', () => {
  let component: ConverterAndCleanSqlToXmlCsvContentComponent;
  let fixture: ComponentFixture<ConverterAndCleanSqlToXmlCsvContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConverterAndCleanSqlToXmlCsvContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConverterAndCleanSqlToXmlCsvContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
