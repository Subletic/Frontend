import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuePopupComponent } from './continue-popup.component';

describe('ContinuePopupComponent', () => {
  let component: ContinuePopupComponent;
  let fixture: ComponentFixture<ContinuePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContinuePopupComponent]
    });
    fixture = TestBed.createComponent(ContinuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
