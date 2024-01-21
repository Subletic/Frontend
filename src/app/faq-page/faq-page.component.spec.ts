import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqPageComponent } from './faq-page.component';
import { FaqComponent } from './faq/faq.component';

describe('FaqPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FaqPageComponent,
        FaqComponent
      ],
    }).compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
