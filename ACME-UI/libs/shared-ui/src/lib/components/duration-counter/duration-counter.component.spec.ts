import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationCounterComponent } from './duration-counter.component';

describe('DurationCounterComponent', () => {
  let component: DurationCounterComponent;
  let fixture: ComponentFixture<DurationCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationCounterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
