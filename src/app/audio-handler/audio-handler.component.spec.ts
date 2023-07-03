import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AudioHandlerComponent } from './audio-handler.component';
import { SignalRService } from '../service/signalRService';

describe('AudioHandlerComponent', () => {
  let component: AudioHandlerComponent;
  let fixture: ComponentFixture<AudioHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioHandlerComponent],
      providers: [SignalRService]
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

    expect(component['audioBuffer'].subarray(0, int16Array.length)).toEqual(expectedFloat32Array);
  });

  it('should create audio nodes in createNodes method', () => {
    component.createNodes();
    expect(component.getGainNode()).toBeTruthy();
    expect(component.getSourceNode()).toBeTruthy();
    if(component.getSourceNode()) return;
    expect(component.getSourceNode()?.buffer).toEqual(component.getNodeAudioBuffer());
  });

  /*
  it('should set the volume in setVolume method', () => {
    const volume = 0.5;
    component.setVolume(volume);
    expect(component.getGainNode().gain.value).toEqual(volume);
  });
  */
});
