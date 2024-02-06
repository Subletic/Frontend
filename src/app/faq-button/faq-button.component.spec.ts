import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqButtonComponent } from './faq-button.component';

describe('FaqPageComponent', () => {
  let component: FaqButtonComponent;
  let fixture: ComponentFixture<FaqButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
