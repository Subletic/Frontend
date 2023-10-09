export class CircularBuffer {
  private readonly size: number;
  private readonly buffer: Float32Array;
  private writePointer: number;
  private readPointer: number;
  constructor(size: number) {
    this.size = size;
    this.buffer = new Float32Array(size);
    this.writePointer = 0;
    this.readPointer = 0;
  }

  write(value: number) {
    this.buffer[this.writePointer] = value;
    this.writePointer = (this.writePointer + 1) % this.size;
  }

  readNextSecond() {
    const oldReadPointer = this.readPointer;
    const newReadPointer = (this.readPointer + 48000) % this.size;
    this.readPointer = newReadPointer;

    return this.buffer.subarray(oldReadPointer, newReadPointer);
  }
}
