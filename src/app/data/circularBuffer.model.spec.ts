import { CircularBuffer } from "./circularBuffer.model";

describe('CircularBuffer', () => {
  let circularBuffer: CircularBuffer;
  const SAMPLE_RATE = 128;
  const BUFFERSIZE_IN_SECONDS = 10;
  const ELEMENTS_IN_BUFFER = SAMPLE_RATE * BUFFERSIZE_IN_SECONDS;

  beforeEach(() => {
    circularBuffer = new CircularBuffer(SAMPLE_RATE, BUFFERSIZE_IN_SECONDS);
  });

  it('should initialize with empty values', () => {
    expect(circularBuffer.getBufferData()).toEqual(new Float32Array(ELEMENTS_IN_BUFFER));
  });

  it('should add new Audio Chunk to buffer', () => {
    const audioChunk = new Float32Array(ELEMENTS_IN_BUFFER);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      audioChunk[i] = i;
    }

    circularBuffer.writeNewChunk(audioChunk);
    expect(circularBuffer.readNextSecond()).not.toEqual(new Float32Array(SAMPLE_RATE));
  });

  it('should overwrite old data if full', () => {
    const audioChunkAscending = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      audioChunkAscending[i] = i;
    }
    const audioChunkOnes = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      audioChunkOnes[i] = 1;
    }

    const EXPECTED_ARRAY = Float32Array.from([...audioChunkOnes, ...audioChunkAscending]);

    for (let i = 0; i < BUFFERSIZE_IN_SECONDS; i++) {
      circularBuffer.writeNewChunk(audioChunkAscending);
    }

    circularBuffer.writeNewChunk(audioChunkOnes);

    expect(circularBuffer.getBufferData().subarray(0, 256)).toEqual(EXPECTED_ARRAY);
  });

  it('should read next second of audio data', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      audioChunk[i] = i;
    }

    circularBuffer.writeNewChunk(audioChunk);
    expect(circularBuffer.readNextSecond()).toEqual(audioChunk);
  });

  it('should return null if no data is available', () => {
    expect(circularBuffer.readNextSecond()).toBeNull();
  });

  it('should correctly skip forward', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    const expectedArray = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      expectedArray[i] = 4;
    }

    circularBuffer.advanceReadPointer(4);
    expect(circularBuffer.readNextSecond()).toEqual(expectedArray);
  });

  it('should correctly skip backward', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    const expectedArray = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      expectedArray[i] = 3;
    }

    circularBuffer.readNextSecond();
    circularBuffer.readNextSecond();
    circularBuffer.readNextSecond();
    circularBuffer.readNextSecond();

    circularBuffer.decreaseReadPointer(2);
    expect(circularBuffer.readNextSecond()).toEqual(expectedArray);
  });

  it('should not skip outside of boundaries going backwards', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    const expectedArray = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      expectedArray[i] = circularBuffer['safetyMarginInSeconds'];
    }

    circularBuffer.readNextSecond();

    circularBuffer.decreaseReadPointer(4);

    expect(circularBuffer.readNextSecond()).toEqual(expectedArray);
  });

  it('should not skip outside of boundaries going forwards', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    const expectedArray = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      expectedArray[i] = BUFFERSIZE_IN_SECONDS - circularBuffer['safetyMarginInSeconds'];
    }

    circularBuffer.readNextSecond();

    circularBuffer.advanceReadPointer(10);

    expect(circularBuffer.readNextSecond()).toEqual(expectedArray);
  });

  it('should not retain playback position if data is too old', () => {
    const audioChunk = new Float32Array(SAMPLE_RATE);
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    circularBuffer.readNextSecond();

    for (let iteration = 0; iteration < 5; iteration++) {
      for (let i = 0; i < SAMPLE_RATE; i++) {
        audioChunk[i] = iteration;
      }
      circularBuffer.writeNewChunk(audioChunk);
    }

    const expectedArray = new Float32Array(SAMPLE_RATE);
    for (let i = 0; i < SAMPLE_RATE; i++) {
      expectedArray[i] = 6;
    }

    expect(circularBuffer.readNextSecond()).toEqual(expectedArray);
  });
});
