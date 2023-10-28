/**
 * Circular buffer for audio data.
 * Old data will be overwritten if buffer is full.
 * Handles playback and recording of audio data independently of each other.
 *///
export class CircularBuffer {
  private readonly buffer: Float32Array;
  private readonly totalBufferSize: number;

  private readonly samplingRate: number;
  private readonly bufferLengthInSeconds: number;

  // Actual pointers used for data access in the circular buffer itself
  private writePointer: number;
  private readPointer: number;

  // Absolute time measurements for pointers, used for collision detection
  private absoluteReadTimeInSeconds: number;
  private absoluteWriteTimeInSeconds: number;

  // Amount of seconds that Read Pointer should be away from buffer ends
  private readonly safetyMarginInSeconds: number


  /**
   * Creates a new circular buffer with the given sampling rate and length in seconds.
   * @param samplingRate - The sampling rate of the audio data.
   * @param lengthInSeconds - The length of the buffer in seconds.
   * @param safetyMarginInSeconds - The amount of seconds that the read pointer should be away from the buffer ends. Defaults to 2 seconds.
   */
  constructor(samplingRate: number, lengthInSeconds: number, safetyMarginInSeconds = 2) {
    this.samplingRate = samplingRate;
    this.bufferLengthInSeconds = lengthInSeconds;
    this.safetyMarginInSeconds = safetyMarginInSeconds;
    this.writePointer = 0;
    this.readPointer = 0;
    this.absoluteReadTimeInSeconds = 0;
    this.absoluteWriteTimeInSeconds = 0;
    this.totalBufferSize = this.samplingRate * this.bufferLengthInSeconds;
    this.buffer = new Float32Array(this.totalBufferSize);
  }

  /**
   * Writes a new chunk of audio data to the buffer.
   * If the buffer is full, the oldest data will be overwritten.
   * @param chunk - The new chunk of audio data to write. Usually 1 second of audio data.
   */
  writeNewChunk(chunk: Float32Array): void {
    for (let i = 0; i < chunk.length; i++) {
      this.buffer[this.writePointer] = chunk[i];
      this.writePointer = this.writePointer + 1;
      if (this.writePointer >= this.totalBufferSize) {
        this.writePointer = 0;
      }
    }

    this.absoluteWriteTimeInSeconds += 1;
  }

  /**
   * Reads the next second of audio data from the buffer.
   * @returns The next second of audio data or null if no data is available.
   *
   */
  readNextSecond(): Float32Array | null {
    const readWriteTimeDifference = this.absoluteWriteTimeInSeconds - this.absoluteReadTimeInSeconds;
    let oldReadPointer = this.readPointer;

    let newReadPointer;

    console.log("read pointer: " + this.absoluteReadTimeInSeconds)
    console.log("write pointer: " + this.absoluteWriteTimeInSeconds);
    console.log("Read write diff: " + readWriteTimeDifference)

    // Check if read pointer is already overwritten with new data
    if (readWriteTimeDifference >= this.bufferLengthInSeconds) {
      // Read pointer too old
      newReadPointer = (this.writePointer - this.totalBufferSize) + (this.safetyMarginInSeconds * this.samplingRate);
      oldReadPointer = (newReadPointer - this.samplingRate) % this.totalBufferSize;
      this.absoluteReadTimeInSeconds = (this.absoluteWriteTimeInSeconds - this.bufferLengthInSeconds) + this.safetyMarginInSeconds;
    } else {
      newReadPointer = (oldReadPointer + this.samplingRate) % this.totalBufferSize;
    }

    // Check if Read Pointer is trying to overtake Write Pointer
    if (this.absoluteReadTimeInSeconds >= this.absoluteWriteTimeInSeconds) {
      console.log("Read Time greater than Write Time!")
      return null;
    }

    this.absoluteReadTimeInSeconds += 1;
    this.readPointer = newReadPointer;

    // Check if Target Array overflows buffer end
    if (oldReadPointer > newReadPointer) {
      const firstHalf = this.buffer.subarray(oldReadPointer, this.totalBufferSize);
      const secondHalf = this.buffer.subarray(0, newReadPointer);
      return Float32Array.of(...firstHalf, ...secondHalf)
    }
    return this.buffer.subarray(oldReadPointer, newReadPointer);
  }


  /**
   * Advances the read pointer by the given amount of seconds.
   * Used for skipping forward in the audio playback.
   * @param secondsToAdvance - The amount of seconds to advance the read pointer by.
   */
  public advanceReadPointer(secondsToAdvance: number): void {
    const samplesToAdvance = secondsToAdvance * this.samplingRate;
    this.readPointer = (this.readPointer + samplesToAdvance) % this.totalBufferSize;
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
  public decreaseReadPointer(secondsToDecrease: number): void {
    const samplesToAdvance = secondsToDecrease * this.samplingRate;
    this.readPointer = (this.readPointer - samplesToAdvance) % this.totalBufferSize;
    this.absoluteReadTimeInSeconds -= secondsToDecrease;

    // Keep Read Pointer away from End of Buffer
    const endOfBufferTimeTimestamp = this.absoluteWriteTimeInSeconds - this.bufferLengthInSeconds;
    if (this.absoluteReadTimeInSeconds <= endOfBufferTimeTimestamp) {
      this.absoluteReadTimeInSeconds = endOfBufferTimeTimestamp + this.safetyMarginInSeconds;
      this.readPointer = this.writePointer - this.totalBufferSize + (this.safetyMarginInSeconds * this.samplingRate);
    }
  }

  /**
   * Gets current content of the circular buffer.
   */
  public getBufferData(): Float32Array {
    return this.buffer
  }
}
