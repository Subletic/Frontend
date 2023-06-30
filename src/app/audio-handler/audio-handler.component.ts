import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";


/**
 * The AudioHandlerComponent represents a component that handles audio playback and buffering.
 */
@Component({
  selector: 'app-audio-handler',
  templateUrl: './audio-handler.component.html',
  styleUrls: ['./audio-handler.component.scss']
})
export class AudioHandlerComponent implements OnInit {
  // Constants for audio buffering and sampling
  private bufferSizeInSeconds = 120;
  private sampleRate = 48000;
  private maxBufferLength = this.bufferSizeInSeconds * this.sampleRate;
  // Audio buffers and context
  private audioBuffer: Float32Array = new Float32Array(this.maxBufferLength);
  private audioContext = new AudioContext();
  private sourceNode: AudioBufferSourceNode | null = null;
  private elementsInBuffer = 0;
  private nodeAudioBuffer = this.audioContext.createBuffer(1, this.maxBufferLength, this.sampleRate);
  private isSourceNodeStarted = false;
  // Variable for the number of seconds to skip
  private skipSeconds = 5;

  constructor(private signalRService: SignalRService) {
    // Create the source node and assign the node audio buffer
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.nodeAudioBuffer;
  }

  ngOnInit() {
    // Subscribe to the received audio stream event from SignalRService
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });
  }

  /**
   * Resumes audio playback and starts the source node if not started.
   */
  public resumePlayback(): void {
    
    console.log(this.sourceNode)
    if (this.sourceNode) {
      if (!this.sourceNode.buffer) return;
      console.log(this.sourceNode.buffer.getChannelData(0));
      if(this.isSourceNodeStarted === false){
        this.sourceNode.start();
        this.isSourceNodeStarted = true;
      }
      // Resume the audio context to resume playback
      this.audioContext.resume().then(() => console.log('Playback resumed successfully.'));
    }
  }

  /**
   * Concatenates two Float32Array buffers.
   * @param a - First buffer to concatenate.
   * @param b - Second buffer to concatenate.
   * @returns The concatenated Float32Array buffer.
   */
  private concatenateFloat32Arrays(a: Float32Array, b: Float32Array): Float32Array {
    const c = new Float32Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  /**
   * Handles the received audio data chunk.
   * @param newChunk - The new audio chunk received.
   */
  private handleAudioData(newChunk: Int16Array): void {
    // Convert the received Int16Array chunk to Float32Array
    const float32Chunk = new Float32Array(newChunk.length);
    for (let i = 0; i < newChunk.length; i++) {
      float32Chunk[i] = newChunk[i] / 32767;  // Skalierung auf den Bereich von -1 bis 1
    }

    // Check if the buffer is full and discard the oldest part
    if (this.elementsInBuffer + 48000 > this.maxBufferLength) {
      console.log(this.elementsInBuffer);
      const clonedArray = this.audioBuffer.slice(48000, 5760000);

      this.audioBuffer = this.concatenateFloat32Arrays(clonedArray, float32Chunk);

      this.elementsInBuffer -= 48000;
      console.log(this.elementsInBuffer);
    }

    // Add the new chunk to the buffer
    const offset = this.elementsInBuffer;
    this.audioBuffer.set(float32Chunk, offset);
    this.elementsInBuffer += float32Chunk.length;


    // Update the node audio buffer and connect the source node
    this.updatePlayableBuffer();
  }

  /**
   * Updates the node audio buffer with the current audio buffer content and connects the source node.
   */
  private updatePlayableBuffer(): void {
    // Create single channel audio buffer with sampling rate of 48kHz
    this.nodeAudioBuffer.getChannelData(0).set(this.audioBuffer.subarray(0, this.elementsInBuffer));
    this.sourceNode?.buffer?.getChannelData(0).set(this.nodeAudioBuffer.getChannelData(0));

    console.log("Channel data updated successfully.");

    if (!this.sourceNode) {
      return;
    }

    // Connect the source node to the audio context destination
    this.sourceNode.connect(this.audioContext.destination);
  }
  
  /**
   * Pauses audio playback by suspending the audio context.
   */
  public pauseAudio() {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend().then(() => {
        console.log('Audio paused successfully.');
      });
    }
  }

  /**
   * Toggles between playing and stopping audio.
   */
  public playOrStopAudio() {

    if (this.audioContext.state !== 'running') {
      this.resumePlayback();
    } else {
      this.pauseAudio();
    }

  }

  public skipForward() {
    const currentTime = this.audioContext.currentTime;
    const newTime = currentTime + this.skipSeconds;
  
    if (newTime <= this.nodeAudioBuffer.duration) {
      this.sourceNode?.stop();
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.nodeAudioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(0, newTime);
    }
  }
  
  public skipBackward() {
    const currentTime = this.audioContext.currentTime;
    const newTime = currentTime - this.skipSeconds;
  
    if (newTime >= 0) {
      this.sourceNode?.stop();
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.nodeAudioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(0, newTime);
    }
  }
   

}
