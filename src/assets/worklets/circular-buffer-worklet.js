class CircularBufferWorklet extends AudioWorkletProcessor {
  // Audio Buffer related fields
  buffer;
  totalBufferSize;
  samplingRate;
  bufferLengthInSeconds;

  // Playback
  audioPlaying;

  // Actual pointers used for data access in the circular buffer itself
  writePointer;
  readPointer;

  // Keeps track if whole second has been written/read, has to do with frame size of 128 samples
  audioChunksWritten;
  audioChunksRead;

  // Absolute time measurements for pointers, used for collision detection
  absoluteReadTimeInSeconds;
  absoluteWriteTimeInSeconds;

  // Amount of seconds that Read Pointer should be away from buffer ends
  safetyMarginInSeconds;

  constructor() {
    // Worklet initialization
    super();
    this.port.onmessage = (e) => this.handlePortMessage(e.data);

    // Buffer parameters
    const SAMPLE_RATE = 48000;
    const BUFFER_LENGTH_IN_SECONDS = 30;
    const SAFETY_MARGIN_IN_SECONDS = 2;

    // Circular buffer initialization
    this.samplingRate = SAMPLE_RATE;
    this.bufferLengthInSeconds = BUFFER_LENGTH_IN_SECONDS;
    this.safetyMarginInSeconds = SAFETY_MARGIN_IN_SECONDS;

    this.audioPlaying = false;
    this.writePointer = 0;
    this.readPointer = 0;
    this.absoluteReadTimeInSeconds = 0;
    this.absoluteWriteTimeInSeconds = 0;
    this.audioChunksWritten = 0;
    this.audioChunksRead = 0;
    this.totalBufferSize = this.samplingRate * this.bufferLengthInSeconds;
    this.buffer = new Float32Array(this.totalBufferSize);
  }

  handlePortMessage(message) {
    switch (message.type) {
      case 'audioData':
        this.handleNewAudioData(message.audioData);
        break;
      case 'skipForward':
        this.advanceReadPointer(message.seconds)
        break;
      case 'skipBackward':
        this.decreaseReadPointer(message.seconds)
        break;
      case 'pause':
        this.audioPlaying = false;
        break;
      case 'play':
        this.audioPlaying = true;
        break;
      default:
        console.log("Unknown message type!");
    }
  }

  handleNewAudioData(audioChunk) {
    // Audio chunks should usually be 128 samples long
    for (let i = 0; i < audioChunk.length; i++) {
      this.buffer[this.writePointer] = audioChunk[i];
      this.writePointer = this.writePointer + 1;
      if (this.writePointer >= this.totalBufferSize) {
        this.writePointer = 0;
      }
    }

    this.audioChunksWritten += audioChunk.length;

    // Update absolute time measurements when whole second has been written
    if (this.audioChunksWritten >= this.samplingRate) {
      this.absoluteWriteTimeInSeconds += 1;
      this.audioChunksWritten = 0;
    }
  }

  process(inputs, outputs, parameters) {
    if (!this.audioPlaying) {
      return true;
    }

    const outputChannel = outputs[0][0];

    const FRAME_SIZE = outputChannel.length; // Should be 128
    const READ_WRITE_TIME_DIFFERENCE = this.absoluteWriteTimeInSeconds - this.absoluteReadTimeInSeconds;

    let oldReadPointer = this.readPointer;

    let newReadPointer;

    // Check if read pointer is already overwritten with new data
    if (READ_WRITE_TIME_DIFFERENCE >= this.bufferLengthInSeconds) {
      // Read pointer too old
      console.log("Read pointer too old!");
      newReadPointer = (this.writePointer - this.totalBufferSize) + (this.safetyMarginInSeconds * this.samplingRate);
      oldReadPointer = (newReadPointer - this.samplingRate) % this.totalBufferSize;
      this.absoluteReadTimeInSeconds = (this.absoluteWriteTimeInSeconds - this.bufferLengthInSeconds) + this.safetyMarginInSeconds;
    } else {
      newReadPointer = (oldReadPointer + FRAME_SIZE) % this.totalBufferSize;
      this.audioChunksRead += FRAME_SIZE;
    }

    // Check if Read Pointer is trying to overtake Write Pointer
    if (this.absoluteReadTimeInSeconds >= this.absoluteWriteTimeInSeconds) {
      console.log("Read Time greater than Write Time!")
      return true;
    }

    // Check if whole second has been read
    if (this.audioChunksRead >= this.samplingRate) {
      this.absoluteReadTimeInSeconds += 1;
      this.audioChunksRead = 0;
    }

    this.readPointer = newReadPointer;

    let audioDataToBeWritten = this.formOutputDataArray(oldReadPointer, newReadPointer);

    // Write processed audio data to output channel
    for (let i = 0; i < FRAME_SIZE; i++) {
      outputChannel[i] = audioDataToBeWritten[i];
    }

    return true;
  }

  formOutputDataArray(oldReadPointer, newReadPointer) {
    // Check if Target Array overflows buffer end
    if (oldReadPointer > newReadPointer) {
      const FIRST_HALF = this.buffer.subarray(oldReadPointer, this.totalBufferSize);
      const SECOND_HALF = this.buffer.subarray(0, newReadPointer);
      return Float32Array.of(...FIRST_HALF, ...SECOND_HALF)
    } else {
      return this.buffer.subarray(oldReadPointer, newReadPointer);
    }
  }

  /**
   * Advances the read pointer by the given amount of seconds.
   * Used for skipping forward in the audio playback.
   * @param secondsToAdvance - The amount of seconds to advance the read pointer by.
   */
  advanceReadPointer(secondsToAdvance) {
    const SAMPLES_TO_ADVANCE = secondsToAdvance * this.samplingRate;
    this.readPointer = (this.readPointer + SAMPLES_TO_ADVANCE) % this.totalBufferSize;
    this.absoluteReadTimeInSeconds += secondsToAdvance;

    // Keep Read Pointer away from Write Pointer
    if (this.absoluteReadTimeInSeconds >= this.absoluteWriteTimeInSeconds) {
      this.absoluteReadTimeInSeconds = this.absoluteWriteTimeInSeconds - this.safetyMarginInSeconds;
      this.readPointer = this.writePointer - (this.safetyMarginInSeconds * this.samplingRate);
    }
  }

  /**
   * Decreases the read pointer by the given amount of seconds.
   * Used for skipping backward in the audio playback.
   * @param secondsToDecrease - The amount of seconds to decrease the read pointer by.
   */
  decreaseReadPointer(secondsToDecrease) {
    const SAMPLES_TO_ADVANCE = secondsToDecrease * this.samplingRate;
    this.readPointer = (this.readPointer - SAMPLES_TO_ADVANCE) % this.totalBufferSize;
    this.absoluteReadTimeInSeconds -= secondsToDecrease;

    // Keep Read Pointer away from End of Buffer
    const END_OF_BUFFER_TIME_TIMESTAMP = this.absoluteWriteTimeInSeconds - this.bufferLengthInSeconds;
    if (this.absoluteReadTimeInSeconds <= END_OF_BUFFER_TIME_TIMESTAMP) {
      this.absoluteReadTimeInSeconds = END_OF_BUFFER_TIME_TIMESTAMP + this.safetyMarginInSeconds;
      this.readPointer = this.writePointer - this.totalBufferSize + (this.safetyMarginInSeconds * this.samplingRate);
    }
  }
}

registerProcessor('circular-buffer-worklet', CircularBufferWorklet);
