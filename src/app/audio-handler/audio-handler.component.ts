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
  private audioBuffer: Int16Array = new Int16Array(this.maxBufferLength);
  private audioContext = new AudioContext();
  private sourceNode: AudioBufferSourceNode | null = null;
  private elementsInBuffer = 0;
  private nodeAudioBuffer = this.audioContext.createBuffer(1, this.maxBufferLength, this.sampleRate);

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
      this.sourceNode.start();
      this.audioContext.resume().then(() => console.log('Playback resumed successfully.'));
    }
  }

  private concatenateInt16Arrays(a: Int16Array, b: Int16Array): Int16Array {
    const c = new Int16Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  private handleAudioData(newChunk: Int16Array): void {
    // Add received audio data to buffer

    // Check if buffer is full
    if (this.elementsInBuffer + 48000 > this.maxBufferLength) {
      console.log(this.elementsInBuffer);
      const clonedArray = this.audioBuffer.slice(48000, 5760000);

      this.audioBuffer = this.concatenateInt16Arrays(clonedArray, newChunk);

      this.elementsInBuffer -= 48000;
      console.log(this.elementsInBuffer);
    }

    const offset = this.elementsInBuffer;
    this.audioBuffer.set(newChunk, offset);
    this.elementsInBuffer += newChunk.length;

    // Update playing audio
    this.updatePlayableBuffer();
  }

  private updatePlayableBuffer(): void {
    // Create single channel audio buffer with sampling rate of 48kHz
    this.nodeAudioBuffer.getChannelData(0).set(this.audioBuffer);
    this.sourceNode?.buffer?.getChannelData(0).set(this.nodeAudioBuffer.getChannelData(0));

    console.log("Channel data updated successfully.");

    if (!this.sourceNode) {
      return;
    }

    this.sourceNode.connect(this.audioContext.destination);
  }

  public stopAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
  }

  public playOrStopAudio() {

    if (this.sourceNode !== null) {
      this.resumePlayback();
    } else {
      this.stopAudio();
    }

  }
}
