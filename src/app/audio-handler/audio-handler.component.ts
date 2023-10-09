import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";
import {CircularBuffer} from "../data/circularBuffer.model";


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
  private bufferSizeInSeconds = 60 * 5;
  private sampleRate = 48000;
  private maxBufferLength = this.bufferSizeInSeconds * this.sampleRate;
  // Audio buffers and context
  private audioBuffer = new CircularBuffer(this.maxBufferLength);
  private audioContext = new AudioContext();

  private isSourceNodeStarted = false;
  // Variable for the number of seconds to skip
  private skipSeconds = 5;
  //Variable for the speed to play audio in
  private playbackSpeed = 1;
  private jumpCounter = 0;

  private gainNode: GainNode = this.audioContext.createGain();
  private volume = 0;

  private isAudioPlaying = false;

  constructor(private signalRService: SignalRService) {}

  ngOnInit() {
    // Subscribe to the received audio stream event from SignalRService
    this.signalRService.receivedAudioStream.subscribe((newChunk) => {
      this.handleAudioData(newChunk)
    });

    setInterval(() => {
      this.updatePlayableBuffer();
    }, 1000);
  }

  /**
   * Resumes audio playback and starts the source node if not started.
   */
  public togglePlayback(): void {
    if (!this.isAudioPlaying) {
      this.audioContext.resume().then(() => {
        this.isAudioPlaying = !this.isAudioPlaying;
      })
    } else {
      this.audioContext.suspend().then(() => {
        this.isAudioPlaying = !this.isAudioPlaying;
      })
    }
  }

  /**
   * Handles the received audio data chunk.
   * @param newChunk - The new audio chunk received.
   */
  private handleAudioData(newChunk: Int16Array): void {
    // Convert the received Int16Array chunk to Float32Array
    for (let i = 0; i < newChunk.length; i++) {
      const convertedAudioData = newChunk[i] / 32767;  // Skalierung auf den Bereich von -1 bis 1
      this.audioBuffer.write(convertedAudioData)
    }
  }

  /**
   * Updates the node audio buffer with the current audio buffer content and connects the source node.
   */
  private updatePlayableBuffer(): void {
    const audioData = this.audioBuffer.readNextSecond();

    const audioBuffer = this.audioContext.createBuffer(1, audioData.length, this.sampleRate);
    audioBuffer.copyToChannel(audioData, 0, 0)

    const audioNode = new AudioBufferSourceNode(this.audioContext, {buffer: audioBuffer});

    // Connect the source node to the audio context destination
    console.log("Connecting audio node to destination.")
    console.log(audioNode.buffer?.getChannelData(0))
    audioNode.start(0);
    audioNode.connect(this.audioContext.destination);
  }

  // /**
  //  * Sets the playback speed of the audio.
  //  * @param speed - The playback speed to set.
  //  */
  public setPlaybackSpeed(speed: number): void {
    // this.playbackSpeed = speed;
    //
    // if (this.sourceNode) {
    //   this.sourceNode.playbackRate.value = this.playbackSpeed;
    // }
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

    this.isAudioPlaying = false;
  }

  /**
   * Toggles between playing and stopping audio.
   */
  public playOrStopAudio() {
    this.togglePlayback();
  }

  /**
   * Skips forward in the audio playback by the specified number of seconds.
   */
  public skipForward() {
    // if (this.audioContext.state !== 'running') {
    //   return;
    // }
    //
    // const currentTime = this.audioContext.currentTime + this.jumpCounter;
    // const targetTime = Math.min(currentTime + this.skipSeconds, this.audioBuffer.length / this.sampleRate);
    //
    // this.pauseAudio();
    //
    // if (this.sourceNode) {
    //   if (this.isSourceNodeStarted) {
    //     this.sourceNode.stop();
    //     this.isSourceNodeStarted = false;
    //   }
    //   this.sourceNode.disconnect();
    //   this.sourceNode = null;
    // }
    //
    // this.sourceNode = this.audioContext.createBufferSource();
    // this.sourceNode.buffer = this.nodeAudioBuffer;
    // this.sourceNode.connect(this.audioContext.destination);
    //
    // this.jumpCounter = this.jumpCounter + this.skipSeconds;
    //
    // this.audioContext.resume().then(() => {
    //   if (!this.sourceNode) return;
    //
    //   this.updatePlayableBuffer();
    //
    //   this.createNodes();
    //   this.reapplyVolume();
    //
    //   this.sourceNode.start(0, targetTime);
    //   this.isSourceNodeStarted = true;
    // });

    //this.reapplyVolume();
  }

  /**
   * Skips backward in the audio playback by the specified number of seconds.
   */
  public skipBackward() {
    // if (this.audioContext.state !== 'running') {
    //   return;
    // }
    //
    // const currentTime = this.audioContext.currentTime + this.jumpCounter;
    // const targetTime = Math.max(currentTime - this.skipSeconds, 0);
    //
    // this.pauseAudio();
    //
    // if (this.sourceNode) {
    //   if (this.isSourceNodeStarted) {
    //     this.sourceNode.stop();
    //     this.isSourceNodeStarted = false;
    //   }
    //   this.sourceNode.disconnect();
    //   this.sourceNode = null;
    // }
    //
    // this.sourceNode = this.audioContext.createBufferSource();
    // this.sourceNode.buffer = this.nodeAudioBuffer;
    // this.sourceNode.connect(this.audioContext.destination);
    //
    // this.jumpCounter = this.jumpCounter - this.skipSeconds;
    //
    //
    // this.audioContext.resume().then(() => {
    //   if (!this.sourceNode) return;
    //   this.updatePlayableBuffer();
    //
    //   this.createNodes();
    //   this.reapplyVolume();
    //
    //   this.sourceNode.start(0, targetTime);
    //   this.isSourceNodeStarted = true;
    // });
  }

  public reapplyVolume() {
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }

  public getGainNode(): GainNode {
    return this.gainNode;
  }

  // public getSourceNode() {
  //   return this.sourceNode;
  // }
  //
  // public getNodeAudioBuffer() {
  //   return this.nodeAudioBuffer;
  // }

  /**
 * Sets the volume of the audio.
 * @param volume - The volume level to set.
 */
  public setVolume(volume: number) {
    this.volume = volume;
    if (!this.gainNode) return;
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }

  public getVolume() {
    return this.volume;
  }

  public setSkipSeconds(seconds: number) {
    this.skipSeconds = seconds;
  }

  /**
   * Returns the current status of the audio playback.
   * @returns {boolean} True if audio is currently playing, false otherwise.
   */
  public getIsAudioPlaying(): boolean {
    return this.isAudioPlaying;
  }

}
