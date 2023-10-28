import { Component, OnInit } from '@angular/core';
import { SignalRService } from "../service/signalRService";
import { CircularBuffer } from "../data/circularBuffer.model";
//

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
  private readonly BUFFER_SIZE_IN_SECONDS = 30;
  private readonly SAMPLE_RATE = 48000;

  // Audio buffers and context
  private audioBuffer: CircularBuffer = new CircularBuffer(this.SAMPLE_RATE, this.BUFFER_SIZE_IN_SECONDS);
  private audioContext = new AudioContext();

  // Reference to the currently playing AudioNode
  private currentAudioNode: AudioBufferSourceNode | null = null;

  private skipSeconds = 5;
  private playbackSpeed = 1;

  private gainNode: GainNode = this.audioContext.createGain();
  private volume = 1;

  private audioPlaying = false;

  /**
   * Gets the reference to the SignalRService.
   * @param signalRService - The SignalRService to get the reference to.
   */
  constructor(private signalRService: SignalRService) {
  }

  /**
   * Initializes Services and audio nodes
   */
  ngOnInit(): void {
    // Subscribe to the received audio stream event from SignalRService
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });

    const AUDIO_UPDATE_INTERVAL_IN_MS = 1000;

    setInterval(() => {
      this.updateAudioNode();
    }, AUDIO_UPDATE_INTERVAL_IN_MS);

    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * Resumes audio playback and starts the source node if not started.
   */
  public togglePlayback(): void {
    if (!this.audioPlaying) {
      this.audioContext.resume().then(() => {
        this.audioPlaying = true;
      })
    } else {
      this.audioContext.suspend().then(() => {
        this.audioPlaying = false;
      })
    }
  }

  /**
   * Handles the received audio data chunk.
   * @param newChunk - The new audio chunk received.
   */
  private handleAudioData(newChunk: Int16Array): void {
    // Convert the received Int16Array chunk to Float32Array
    const convertedAudioData: Float32Array = new Float32Array(newChunk.length);
    const INT16_TO_FLOAT32_SCALING_FACTOR = 32767;

    for (let i = 0; i < newChunk.length; i++) {
      convertedAudioData[i] = newChunk[i] / INT16_TO_FLOAT32_SCALING_FACTOR;  // Skalierung auf den Bereich von -1 bis 1
    }

    this.audioBuffer.writeNewChunk(convertedAudioData)
  }

  /**
   * Replaces current playing audio node with audio node containing new data
   * Each audio node holds 1s of audio
   */
  private updateAudioNode(): void {
    if (!this.audioPlaying) return;

    const audioData: Float32Array | null = this.audioBuffer.readNextSecond();
    const NUMBER_OF_CHANNELS = 1;

    if (!audioData || audioData.length === 0) return;

    console.log("Audio length:" + audioData.length);

    const audioBuffer: AudioBuffer = this.audioContext.createBuffer(NUMBER_OF_CHANNELS, audioData.length, this.SAMPLE_RATE);
    const SELECTED_CHANNEL = 0;
    const BUFFER_OFFSET = 0;

    audioBuffer.copyToChannel(audioData, SELECTED_CHANNEL, BUFFER_OFFSET)

    const audioNode: AudioBufferSourceNode = new AudioBufferSourceNode(this.audioContext, { buffer: audioBuffer });

    // Connect the source node to the audio context destination
    audioNode.playbackRate.value = this.playbackSpeed;
    audioNode.connect(this.gainNode)

    this.currentAudioNode?.disconnect();
    audioNode.start(0);
    this.currentAudioNode = audioNode;
  }

  /**
   * Sets the playback speed of the audio.
   * @param speed - The playback speed to set.
   */
  public setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }


  /**
   * Skips forward in the audio playback by the specified number of seconds.
   */
  public skipForward(): void {
    this.audioBuffer.advanceReadPointer(this.skipSeconds);
  }

  /**
   * Skips backward in the audio playback by the specified number of seconds.
   */
  public skipBackward(): void {
    this.audioBuffer.decreaseReadPointer(this.skipSeconds);
  }

  /**
   * Sets the volume of the audio.
   * @param volume - The volume level to set.
   */
  public setVolume(volume: number): void {
    const LOWEST_INPUT_VOL_LEVEL = -1;
    const HIGHEST_INPUT_VOL_LEVEL = 1;

    const MAX_VOLUME = 1.5;
    const MIN_VOLUME = 0;

    this.volume = this.mapVolumeToNewScale(volume, LOWEST_INPUT_VOL_LEVEL, HIGHEST_INPUT_VOL_LEVEL, MIN_VOLUME, MAX_VOLUME);

    if (!this.gainNode) return;
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }

  /**
   * Maps number to new range according to original range given
   * @param value Number that's to be mapped
   * @param origMin Lowest value of original range
   * @param origMax Highest value of original range
   * @param newMin Lowest value of new range
   * @param newMax Highest value of new range
   */
  private mapVolumeToNewScale(value: number, origMin: number, origMax: number, newMin: number, newMax: number): number {
    return (value - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Sets amount of seconds to be skipped
   * @param seconds
   */
  public setSkipSeconds(seconds: number): void {
    this.skipSeconds = seconds;
  }

  /**
   * Returns the current status of the audio playback.
   * @returns {boolean} True if audio is currently playing, false otherwise.
   */
  public getIsAudioPlaying(): boolean {
    return this.audioPlaying;
  }
}
