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


  constructor(samplingRate: number, lengthInSeconds: number) {
    this.samplingRate = samplingRate;
    this.bufferLengthInSeconds = lengthInSeconds;
    this.writePointer = 0;
    this.readPointer = 0;
    this.absoluteReadTimeInSeconds = 0;
    this.absoluteWriteTimeInSeconds = 0;
    this.totalBufferSize = this.samplingRate * this.bufferLengthInSeconds;
    this.buffer = new Float32Array(this.totalBufferSize);
  }

  writeNewChunk(chunk: Float32Array) {
    for (let i = 0; i < chunk.length; i++) {
      this.buffer[this.writePointer] = chunk[i];
      this.writePointer = this.writePointer + 1;
      if (this.writePointer >= this.totalBufferSize) {
        this.writePointer = 0;
      }
    }

    this.absoluteWriteTimeInSeconds += 1;
  }

  readNextSecond() {
    const readWriteTimeDifference = this.absoluteWriteTimeInSeconds - this.absoluteReadTimeInSeconds;
    const safetyMarginInSeconds = 2
    let oldReadPointer = this.readPointer;

    let newReadPointer;

    console.log("read pointer: " + this.absoluteReadTimeInSeconds)
    console.log("write pointer: " + this.absoluteWriteTimeInSeconds);
    console.log("Read write diff: " + readWriteTimeDifference)

    // Check if read pointer is already overwritten with new data
    if (readWriteTimeDifference >= this.bufferLengthInSeconds) {
      // Read pointer too old
      newReadPointer = (this.writePointer - this.totalBufferSize) + (safetyMarginInSeconds * this.samplingRate);
      oldReadPointer = (newReadPointer - this.samplingRate) % this.totalBufferSize;
      this.absoluteReadTimeInSeconds = (this.absoluteWriteTimeInSeconds - this.bufferLengthInSeconds) + safetyMarginInSeconds;
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
}
