import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AudioHandlerComponent } from './audio-handler.component';
import { SignalRService } from '../service/signalRService';

//Hard to implement meaningful tests because most methods work directly on the Web Audio API - Audio Elements
class MockAudioContext {
  state: 'running' | 'suspended' = 'suspended';

  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
}

describe('AudioHandlerComponent', () => {
  let component: AudioHandlerComponent;
  let fixture: ComponentFixture<AudioHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioHandlerComponent],
      providers: [
        SignalRService,
        { provide: AudioContext, useClass: MockAudioContext }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should convert Int16Array to Float32Array successfully', () => {
    const int16Array = new Int16Array([32767, 0, -32767]);
    const expectedFloat32Array = new Float32Array([1.0, 0.0, -1.0]);

    component['handleAudioData'](int16Array);

    expect(component['audioBuffer'].getBufferData().subarray(0, int16Array.length)).toEqual(expectedFloat32Array);
  });

  it('should set the volume in setVolume method', () => {
    const sliderVolumeValue = 0.5;
    const targetVolumeValue = 1.125
    component.setVolume(sliderVolumeValue);
    expect(component.getVolume()).toEqual(targetVolumeValue);
  });

  it('should set the skip seconds', () => {
    // Arrange
    const seconds = 10;
    // Act
    component.setSkipSeconds(seconds);
    // Assert
    expect(component['skipSeconds']).toEqual(seconds);
  });
});
