import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterSettingsComponent } from './quarter-settings.component';

describe('QuarterSettingsComponent', () => {
  let component: QuarterSettingsComponent;
  let fixture: ComponentFixture<QuarterSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarterSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
