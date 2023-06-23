import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioHandlerComponent } from './audio-handler.component';

describe('AudioHandlerComponent', () => {
  let component: AudioHandlerComponent;
  let fixture: ComponentFixture<AudioHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioHandlerComponent]
    });
    fixture = TestBed.createComponent(AudioHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
