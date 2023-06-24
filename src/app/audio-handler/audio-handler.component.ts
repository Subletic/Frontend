import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";

@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent implements OnInit {
  private audioBuffer: Int16Array[] = [];
  private bufferSizeInSeconds = 120;
  private sampleRate = 48000;
  private bufferLength = this.bufferSizeInSeconds * this.sampleRate;
  private audioContext = new AudioContext();
  private sourceNode: AudioBufferSourceNode | null = null;


  constructor(private signalRService: SignalRService) {
    this.audioContext = new AudioContext();
  }

  ngOnInit() {
    
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });
  
  }

  public resumePlayback(): void {
    if (this.sourceNode) {
      this.sourceNode.start();
    }

    this.audioContext.resume().then(() => console.log('Playback resumed successfully.'));
  }

  private handleAudioData(newChunk: Int16Array): void {
    // Add received audio data to buffer
    // const audioSamples = this.convertToPCM(newChunk);
    this.audioBuffer.push(newChunk);

    // Check if buffer is full
    if (this.audioBuffer.length >= this.bufferLength) {
      console.log(this.audioBuffer.length);
      this.audioBuffer.slice(48000);
      console.log(this.audioBuffer.length);
    }

    // Update playing audio
    if (this.sourceNode) {
      this.updatePlayableBuffer();
    }
  }

  // Probably not needed anymore
  private convertToPCM(data: Int16Array): Int16Array {
    console.log(typeof data)
    // Convert data to Int16Array for PCM audio
    // Data is received in 1s chunks (48kHz * 2 bytes per sample = 96kB/s)
    const dataView = new DataView(data);
    const pcmData = new Int16Array(data.byteLength / 2); // Assuming 16-bit PCM audio

    for (let i = 0; i < pcmData.length; i++) {
      pcmData[i] = dataView.getInt16(i * 2, true);
    }

    return pcmData;
  }

  private updatePlayableBuffer(): void {
    if (this.sourceNode) {
      // Create single channel audio buffer with sampling rate of 48kHz
      const audioBuffer = this.audioContext.createBuffer(1, this.bufferLength, this.sampleRate);
      const channelData = audioBuffer.getChannelData(0);

      let offset = 0;
      for (let i = 0; i < this.audioBuffer.length; i++) {
        channelData.set(this.audioBuffer[i], offset);
        offset += this.audioBuffer[i].length;
      }

      // Create source Node, connect it to the audio context and start playing
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
    }
  }

  private stopAudio() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
  }
}
