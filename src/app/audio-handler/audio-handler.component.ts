import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";

@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent implements OnInit {
  private bufferSizeInSeconds = 120;
  private sampleRate = 48000;
  private maxBufferLength = this.bufferSizeInSeconds * this.sampleRate;
  private audioBuffer: Float32Array = new Float32Array(this.maxBufferLength);
  private audioContext = new AudioContext();
  private sourceNode: AudioBufferSourceNode | null = null;
  private elementsInBuffer = 0;
  private nodeAudioBuffer = this.audioContext.createBuffer(1, this.maxBufferLength, this.sampleRate);
  private isSourceNodeStarted = false;

  constructor(private signalRService: SignalRService) {
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.nodeAudioBuffer;
  }

  ngOnInit() {
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });
  }

  public resumePlayback(): void {
    
    console.log(this.sourceNode)
    if (this.sourceNode) {
      if (!this.sourceNode.buffer) return;
      console.log(this.sourceNode.buffer.getChannelData(0));
      if(this.isSourceNodeStarted === false){
        this.sourceNode.start();
        this.isSourceNodeStarted = true;
      }
      this.audioContext.resume().then(() => console.log('Playback resumed successfully.'));
    }
  }

  private concatenateFloat32Arrays(a: Float32Array, b: Float32Array): Float32Array {
    const c = new Float32Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  private handleAudioData(newChunk: Int16Array): void {
    //convert from Int16 to Float32
    const float32Chunk = new Float32Array(newChunk.length);
    for (let i = 0; i < newChunk.length; i++) {
      float32Chunk[i] = newChunk[i] / 32767;  // Skalierung auf den Bereich von -1 bis 1
    }

    // Check if buffer is full
    if (this.elementsInBuffer + 48000 > this.maxBufferLength) {
      console.log(this.elementsInBuffer);
      const clonedArray = this.audioBuffer.slice(48000, 5760000);

      this.audioBuffer = this.concatenateFloat32Arrays(clonedArray, float32Chunk);

      this.elementsInBuffer -= 48000;
      console.log(this.elementsInBuffer);
    }

    const offset = this.elementsInBuffer;
    this.audioBuffer.set(float32Chunk, offset);
    this.elementsInBuffer += float32Chunk.length;


    // Update playing audio
    this.updatePlayableBuffer();
  }

  private updatePlayableBuffer(): void {
    // Create single channel audio buffer with sampling rate of 48kHz
    this.nodeAudioBuffer.getChannelData(0).set(this.audioBuffer.subarray(0, this.elementsInBuffer));
    this.sourceNode?.buffer?.getChannelData(0).set(this.nodeAudioBuffer.getChannelData(0));

    console.log("Channel data updated successfully.");

    if (!this.sourceNode) {
      return;
    }

    this.sourceNode.connect(this.audioContext.destination);
  }

  public pauseAudio() {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend().then(() => {
        console.log('Audio paused successfully.');
      });
    }
  }

  public playOrStopAudio() {

    if (this.audioContext.state !== 'running') {
      this.resumePlayback();
    } else {
      this.pauseAudio();
    }

  }
}
