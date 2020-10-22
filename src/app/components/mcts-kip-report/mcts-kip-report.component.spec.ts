import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MCTSKIPReportComponent } from './mcts-kip-report.component';

describe('MCTSKIPReportComponent', () => {
  let component: MCTSKIPReportComponent;
  let fixture: ComponentFixture<MCTSKIPReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MCTSKIPReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCTSKIPReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
