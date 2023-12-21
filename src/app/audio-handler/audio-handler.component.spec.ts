import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AudioHandlerComponent } from './audio-handler.component';
import { backendListener } from '../service/backend-listener.service';

// Hard to implement meaningful tests because most methods work directly on the Web Audio API - Audio Elements

describe('AudioHandlerComponent', () => {
  let component: AudioHandlerComponent;
  let fixture: ComponentFixture<AudioHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioHandlerComponent],
      providers: [backendListener],
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

  it('should set the volume in setVolume method', () => {
    const sliderVolumeValue = 0.5;
    const targetVolumeValue = 1.125;
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

  it('should set playback speed correctly', () => {
    const speed = 1.5;

    component.setPlaybackSpeed(speed);

    expect(component['sampleRate']).toEqual(72000);
  });

  it('should initialize audio contexts correctly', () => {
    component.initAudioContexts(1);

    expect(component['audioContexts'].length).toEqual(7);
  });
});
