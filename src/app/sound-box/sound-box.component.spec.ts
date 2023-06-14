import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundBoxComponent } from './sound-box.component';

describe('SoundBoxComponent', () => {
  let component: SoundBoxComponent;
  let fixture: ComponentFixture<SoundBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoundBoxComponent]
    });
    fixture = TestBed.createComponent(SoundBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
