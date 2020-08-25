import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualOfficeComponent } from './virtual-office.component';

describe('VirtualOfficeComponent', () => {
  let component: VirtualOfficeComponent;
  let fixture: ComponentFixture<VirtualOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
