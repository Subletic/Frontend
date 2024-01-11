import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotkeyMenueComponent } from './hotkey-menue.component';

describe('HotkeyMenueComponent', () => {
  let component: HotkeyMenueComponent;
  let fixture: ComponentFixture<HotkeyMenueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotkeyMenueComponent]
    });
    fixture = TestBed.createComponent(HotkeyMenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
