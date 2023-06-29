import { TestBed } from '@angular/core/testing';
import { AudioHandlerComponent } from './audio-handler.component';

describe('AudioHandlerComponent', () => {
  let component: AudioHandlerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioHandlerComponent],
    });
    const fixture = TestBed.createComponent(AudioHandlerComponent);
    component = fixture.componentInstance;
  });

  it('should convert Int16Array to Float32Array successfully', () => {
    const int16Array = new Int16Array([32767, 0, -32767]);
    const expectedFloat32Array = new Float32Array([1.0, 0.0, -1.0]);

    component['handleAudioData'](int16Array);

    expect(component['audioBuffer'].subarray(0, int16Array.length)).toEqual(expectedFloat32Array);
  });

});
