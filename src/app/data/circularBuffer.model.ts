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

    writeNewChunk(chunk: Float32Array) {
        for (let i = 0; i < chunk.length; i++) {
            this.buffer[this.writePointer] = chunk[i];
            this.writePointer = this.writePointer + 1;
            if (this.writePointer >= this.size) {
                this.writePointer = 0;
            }
        }
    }

    readNextSecond() {
        let oldReadPointer = this.readPointer;

        // TODO: Handle overflow of readPointer when playback is paused

        if (oldReadPointer >= this.size) {
            oldReadPointer = 0;
        }
        const newReadPointer = (oldReadPointer + 48000);

        this.readPointer = newReadPointer;

        return this.buffer.subarray(oldReadPointer, newReadPointer);
    }
}
