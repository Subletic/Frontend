class CircularBufferWorklet extends AudioWorkletProcessor {
  buffer;
  totalBufferSize;

  samplingRate;
  bufferLengthInSeconds;

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
    this.port.onmessage = (e) => this.handleNewAudioData(e.data);

    // Buffer parameters
    const SAMPLE_RATE = 48000;
    const BUFFER_LENGTH_IN_SECONDS = 10;
    const SAFETY_MARGIN_IN_SECONDS = 2;

    // Circular buffer initialization
    this.samplingRate = SAMPLE_RATE;
    this.bufferLengthInSeconds = BUFFER_LENGTH_IN_SECONDS;
    this.safetyMarginInSeconds = SAFETY_MARGIN_IN_SECONDS;

    this.writePointer = 0;
    this.readPointer = 0;
    this.absoluteReadTimeInSeconds = 0;
    this.absoluteWriteTimeInSeconds = 0;
    this.audioChunksWritten = 0;
    this.audioChunksRead = 0;
    this.totalBufferSize = this.samplingRate * this.bufferLengthInSeconds;
    this.buffer = new Float32Array(this.totalBufferSize);
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
}

registerProcessor('circular-buffer-worklet', CircularBufferWorklet);
