import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeNgTableComponent } from './prime-ng-table.component';

describe('PrimeNgTableComponent', () => {
  let component: PrimeNgTableComponent;
  let fixture: ComponentFixture<PrimeNgTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimeNgTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeNgTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
