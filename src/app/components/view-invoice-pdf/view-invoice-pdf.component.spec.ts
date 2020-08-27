import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoicePdfComponent } from './view-invoice-pdf.component';

describe('ViewInvoicePdfComponent', () => {
  let component: ViewInvoicePdfComponent;
  let fixture: ComponentFixture<ViewInvoicePdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoicePdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoicePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
