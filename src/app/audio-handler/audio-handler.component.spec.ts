import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
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

    expect(component['audioBuffer'].subarray(0, int16Array.length)).toEqual(expectedFloat32Array);
  });

  it('should create audio nodes in createNodes method', () => {
    component.createNodes();
    expect(component.getGainNode()).toBeTruthy();
    expect(component.getSourceNode()).toBeTruthy();
    if(component.getSourceNode()) return;
    expect(component.getSourceNode()?.buffer).toEqual(component.getNodeAudioBuffer());
  });

  it('should set the volume in setVolume method', () => {
    const volume = 0.5;
    component.createNodes();
    component.setVolume(volume);
    expect(component.getVolume()).toEqual(volume);
  });

  it('should not resume playback if sourceNode is null', () => {
    component['sourceNode'] = null;
    spyOn(component['audioContext'], 'resume');

    component.resumePlayback();

    expect(component['audioContext'].resume).not.toHaveBeenCalled();
    expect(component['isAudioPlaying']).toBeFalse();
  });

  it('should not resume playback if sourceNode.buffer is null', () => {
    component['sourceNode'] = component['audioContext'].createBufferSource();
    component['sourceNode'].buffer = null;
    spyOn(component['audioContext'], 'resume');

    component.resumePlayback();

    expect(component['audioContext'].resume).not.toHaveBeenCalled();
    expect(component['isAudioPlaying']).toBeFalse();
  });
  
  it('should not resume playback if sourceNode is started', () => {
    spyOn(component['audioContext'], 'resume');
    component['isSourceNodeStarted'] = true;
    component['sourceNode'] = component['audioContext'].createBufferSource();
  
    component.resumePlayback();
  
    expect(component['audioContext'].resume).not.toHaveBeenCalled();
    expect(component['isAudioPlaying']).toBeFalse();
  });
  
  
});
