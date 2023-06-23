import {Component} from '@angular/core';

@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent {
  private audioBuffer: Int16Array[] = [];
  private bufferSizeInSeconds = 120;
  private sampleRate = 48000;
  private bufferLength = this.bufferSizeInSeconds * this.sampleRate;
  private audioContext = new AudioContext();
  private sourceNode: AudioBufferSourceNode | null = null;

  constructor() {
    this.audioContext = new AudioContext();

    // Establish connection to WebSocket running on backend
    // const connection = new WebSocket(environment.apiURL.replace('http', 'ws') + '/audio');
    const connection = new WebSocket("ws://localhost:3000");
    console.log("Audio-Websocket connected!");
    // connection.addEventListener('message', (event) => this.handleAudioData(event));
    connection.onmessage = (event) => this.handleAudioData(event);
  }

  public resumePlayback(): void {
    if (this.sourceNode) {
      this.sourceNode.start();
    }

    this.audioContext.resume().then(() => console.log('Playback resumed successfully.'));
  }

  private handleAudioData(event: MessageEvent): void {
    // Add received audio data to buffer
    const audioData = event.data;
    console.log(audioData);
    // const audioSamples = this.convertToPCM(audioData);
    this.audioBuffer.push(audioData);

    // Check if buffer is full
    if (this.audioBuffer.length >= this.bufferLength) {
      this.audioBuffer.shift(); // Remove oldest audio data
    }

    // Update playing audio
    if (this.sourceNode) {
      this.updatePlayableBuffer();
    }
  }

  private convertToPCM(data: ArrayBuffer): Int16Array {
    console.log(typeof data)
    // Convert data to Int16Array for PCM audio
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
