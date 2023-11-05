import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";
import * as Tone from 'tone'

/**
 * The WorkletState interface represents the state of the AudioWorklet.
 */
interface WorkletState {
  buffer: Float32Array,
  bufferLengthInSeconds: number,
  audioPlaying: boolean,
  writePointer: number,
  readPointer: number,
  audioChunksWritten: number,
  audioChunksRead: number,
  absoluteReadTimeInSeconds: number,
  absoluteWriteTimeInSeconds: number,
  safetyMarginInSeconds: number,
}

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
  private sampleRate = 48000;

  // Audio buffers and context
  private audioContexts: AudioContext[] = [];
  private audioBuffers: AudioWorkletNode[] = [];

  private audioContext: AudioContext = new AudioContext();
  private audioBufferNode: AudioWorkletNode | undefined;
  private gainNode: GainNode = new GainNode(this.audioContext);


  private pitchModifier = 0;

  private skipSeconds = 5;

  private volume = 1;

  private audioPlaying = false;

  /**
   * Gets the reference to the SignalRService and Initializes the AudioWorklet.
   * @param signalRService - The SignalRService to get the reference to.
   */
  constructor(private signalRService: SignalRService) {
    const BASE_SAMPLE_RATE = 48000;
    const SPEED_MULTIPLIERS = [0.5, 0.7, 0.9, 1, 1.1, 1.3, 1.5]


    // Setup all audio contexts
    for (const multiplier of SPEED_MULTIPLIERS) {
      const audioContext = new AudioContext({sampleRate: BASE_SAMPLE_RATE * multiplier})
      audioContext.audioWorklet
        .addModule('/assets/worklets/circular-buffer-worklet.js')
        .catch((err) => {
          console.error("Error loading worklet: " + err)
        })
        .then(() => {
          const newAudioBufferNode = new AudioWorkletNode(audioContext, 'circular-buffer-worklet')
          newAudioBufferNode.port.onmessage = (event) => {
            this.replaceAudioContext(event.data)
          }
          this.audioBuffers.push(newAudioBufferNode)

          // Set default audio context for initial playback
          if (multiplier === 1) {
            this.audioBufferNode = newAudioBufferNode;
            this.audioContext = audioContext;

            Tone.setContext(this.audioContext);

            this.gainNode = this.audioContext.createGain();
            this.audioBufferNode.connect(this.gainNode);

            const pitchShiftNode = new Tone.PitchShift();
            pitchShiftNode.channelCount = 1;
            pitchShiftNode.pitch = 0;

            Tone.connect(this.gainNode, pitchShiftNode);
            Tone.connect(pitchShiftNode, this.audioContext.destination)
          }
        });
      this.audioContexts.push(audioContext)
    }
  }


  /**
   * Initializes SignalR stream connection.
   */
  ngOnInit(): void {
    // Subscribe to the received audio stream event from SignalRService
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });
  }

  /**
   * Resumes audio playback and starts the source node if not started.
   */
  public togglePlayback(): void {
    if (!this.audioPlaying) {
      this.audioContext.resume().then(() => {
        console.log(this.audioContext)
        this.audioPlaying = true;
        this.audioBufferNode?.port.postMessage({type: "play"});
      })
    } else {
      this.audioContext.suspend().then(() => {
        this.audioPlaying = false;
        this.audioBufferNode?.port.postMessage({type: "pause"});
      })
    }
  }


  /**
   * Converts AudioChunks to Float32 and sends them to AudioWorklet.
   * @param newChunk - The new audio chunk received.
   */
  private handleAudioData(newChunk: Int16Array): void {
    // Convert the received Int16Array chunk to Float32Array
    const convertedAudioData: Float32Array = new Float32Array(newChunk.length);
    const INT16_TO_FLOAT32_SCALING_FACTOR = 32767;

    for (let i = 0; i < newChunk.length; i++) {
      convertedAudioData[i] = newChunk[i] / INT16_TO_FLOAT32_SCALING_FACTOR;  // Skalierung auf den Bereich von -1 bis 1
    }

    const WORKLET_FRAME_SIZE = 128;
    const ITERATIONS_NEEDED_FOR_FULL_SECOND = this.sampleRate / WORKLET_FRAME_SIZE;

    for (let i = 0; i < ITERATIONS_NEEDED_FOR_FULL_SECOND; i++) {
      this.audioBufferNode?.port.postMessage({
        type: "audioData",
        audioData: convertedAudioData.subarray(i * WORKLET_FRAME_SIZE, (i + 1) * WORKLET_FRAME_SIZE)
      });
    }
  }


  /**
   * Sets the playback speed of the audio.
   * @param speed - The playback speed to set.
   */
  public setPlaybackSpeed(speed: number): void {
    const BASE_SAMPLE_RATE = 48000;
    this.setPitchModifier(speed);
    this.sampleRate = Math.round(BASE_SAMPLE_RATE * speed);
    this.audioBufferNode?.port.postMessage({type: "getWorkletState"});
  }


  /**
   * Skips forward in the audio playback by the specified number of seconds.
   */
  public skipForward(): void {
    this.audioBufferNode?.port.postMessage({type: "skipForward", seconds: this.skipSeconds});
  }

  /**
   * Skips backward in the audio playback by the specified number of seconds.
   */
  public skipBackward(): void {
    this.audioBufferNode?.port.postMessage({type: "skipBackward", seconds: this.skipSeconds})
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

  /**
   * Returns the current volume level.
   * @returns {number} The current volume level.
   */
  public getVolume(): number {
    return this.volume;
  }

  /**
   * Sets amount of seconds to be skipped
   * @param {number} seconds The amount of seconds to be skipped
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

  private replaceAudioContext(workletState: WorkletState): void {
    console.log("replace called!")
    this.audioBufferNode?.port.postMessage({type: "pause"});
    this.audioBufferNode?.disconnect();
    this.gainNode.disconnect();

    this.audioContext = this.audioContexts.find(
      (audioContext) => audioContext.sampleRate === this.sampleRate) ?? this.audioContexts[3];

    this.audioBufferNode = this.audioBuffers.find(
      (audioBuffer) => audioBuffer.context.sampleRate === this.sampleRate) ?? this.audioBuffers[3];

    this.audioBufferNode?.port.postMessage({
      type: "setWorkletState",
      workletState: workletState,
    });
    this.audioBufferNode?.port.postMessage({type: "play"});

    Tone.setContext(this.audioContext)

    const pitchShiftNode = new Tone.PitchShift();
    pitchShiftNode.channelCount = 1;
    pitchShiftNode.pitch = this.pitchModifier;

    this.gainNode = this.audioContext.createGain();
    this.audioBufferNode?.connect(this.gainNode);

    if (this.audioBufferNode == undefined) return;

    Tone.connect(this.gainNode, pitchShiftNode);
    Tone.connect(pitchShiftNode, this.audioContext.destination)
  }

  private setPitchModifier(playbackRate: number): void {
    // Formula to convert playback rate to pitch modifier
    this.pitchModifier = (-12 * Math.log2(playbackRate));
    console.log("Pitch modifier: " + this.pitchModifier);
  }
}
