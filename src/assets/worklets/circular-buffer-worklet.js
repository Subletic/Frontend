/**
 * This worklet is responsible for managing the circular buffer.
 * It receives audio data from the main thread and writes it to the buffer.
 */
class CircularBufferWorklet extends AudioWorkletProcessor {
  // Audio Buffer related fields
  buffer;
  totalBufferSize;
  samplesPerSecond;
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
  absoluteReadTimeInMilliseconds;
  absoluteWriteTimeInMilliseconds;

  // Amount of seconds that Read Pointer should be away from buffer ends
  safetyMarginInSeconds;

  /**
   * Initializes configuration values for the circular buffer.
   */
  constructor() {
    // Worklet initialization
    super();
    this.port.onmessage = (e) => this.handlePortMessage(e.data);

    // Buffer parameters
    const SAMPLE_RATE = 48000;
    const BUFFER_LENGTH_IN_SECONDS = 120;
    const SAFETY_MARGIN_IN_SECONDS = 2;

    // Circular buffer initialization
    this.samplesPerSecond = SAMPLE_RATE;
    this.bufferLengthInSeconds = BUFFER_LENGTH_IN_SECONDS;
    this.safetyMarginInSeconds = SAFETY_MARGIN_IN_SECONDS;

    this.setInitialPlaybackState();
  }

  /**
   * Sets the initial playback state of the worklet.
   */
  setInitialPlaybackState() {
    this.audioPlaying = false;
    this.writePointer = 0;
    this.readPointer = 0;
    this.absoluteReadTimeInMilliseconds = 0;
    this.absoluteWriteTimeInMilliseconds = 0;
    this.audioChunksWritten = 0;
    this.audioChunksRead = 0;
    this.totalBufferSize = this.samplesPerSecond * this.bufferLengthInSeconds;
    this.buffer = new Float32Array(this.totalBufferSize);
  }

  /**
   * Handles messages received over the worklet port and calls the appropriate functions.
   * @param message - The message received over the worklet port.
   */
  handlePortMessage(message) {
    switch (message.type) {
      case 'audioData':
        this.handleNewAudioData(message.audioData);
        break;
      case 'skipForward':
        this.advanceReadPointer(message.seconds);
        break;
      case 'skipBackward':
        this.decreaseReadPointer(message.seconds);
        break;
      case 'pause':
        this.audioPlaying = false;
        break;
      case 'play':
        this.audioPlaying = true;
        break;
      case 'setPlaybackRate':
        this.playbackRate = message.playbackRate;
        break;
      case 'getWorkletState':
        this.postWorkletState();
        break;
      case 'setWorkletState':
        this.setWorkletState(message.workletState);
        break;
      case 'setBufferLength':
        this.bufferLengthInSeconds = message.bufferLengthInSeconds;
        this.totalBufferSize = this.samplesPerSecond * this.bufferLengthInSeconds;
        this.buffer = new Float32Array(this.totalBufferSize);
        break;
      default:
        console.log('Unknown message type!');
    }
  }

  /**
   * Writes new audio chunks received over the massaging port to the circular buffer.
   * @param audioChunk - The audio chunk to be written to the circular buffer.
   */
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
    if (this.audioChunksWritten >= this.samplesPerSecond) {
      this.absoluteWriteTimeInMilliseconds += 1000;
      this.audioChunksWritten = 0;
    }
  }

  /**
   * Updates the play state of the worklet.
   * Notifies the main thread of the new play state.
   * @param playState
   */
  updatePlayState(playState) {
    this.audioPlaying = playState;

    this.port.postMessage({
      type: 'playState',
      audioPlaying: this.audioPlaying,
    });
  }

  /**
   * Moves audio data from the circular buffer to the output buffer of the worklet.
   * Handles playback position and collision detection.
   * @param inputs - The input audio data, in this case unused as data is received over the worklet port.
   * @param outputs - The outputs of the worklet, in this case only one output and one channel are used.
   * @param parameters - The parameters of the worklet, in this case unused.
   * @returns {boolean} - True if the worklet should continue processing audio data, false otherwise.
   */
  process(inputs, outputs, parameters) {
    if (!this.audioPlaying) {
      return true;
    }

    // Check if Read Pointer is trying to overtake Write Pointer
    if (this.absoluteReadTimeInMilliseconds >= this.absoluteWriteTimeInMilliseconds) {
      this.updatePlayState(false);
      return true;
    }

    const outputChannel = outputs[0][0];
    const FRAME_SIZE = outputChannel.length; // Should be 128

    const bufferPointers = this.calculateNewBufferPointers(FRAME_SIZE);

    // Check if 1/10 of a second has been read
    if (this.audioChunksRead >= this.samplesPerSecond / 100) {
      this.setNewAbsoluteReadTime(this.absoluteReadTimeInMilliseconds + 10);
      this.audioChunksRead -= this.samplesPerSecond / 100;
    }

    this.readPointer = bufferPointers[1];

    const audioDataToBeWritten = this.formOutputDataArray(bufferPointers[0], bufferPointers[1]);

    // Write processed audio data to output channel
    for (let i = 0; i < audioDataToBeWritten.length; i++) {
      outputChannel[i] = audioDataToBeWritten[i];
    }

    return true;
  }

  /**
   * Calculates the new pointers used for accessing the circular buffer.
   * The pointers are calculated based on playbackSpeed and read/write pointer positions.
   * @param FRAME_SIZE
   * @returns {number[]}
   */
  calculateNewBufferPointers(FRAME_SIZE) {
    const READ_WRITE_TIME_DIFFERENCE =
      this.absoluteWriteTimeInMilliseconds - this.absoluteReadTimeInMilliseconds;
    const AMOUNT_OF_SAMPLES_TO_READ = FRAME_SIZE;
    const SECONDS_TO_MILLISECONDS_MULTIPLIER = 1000;
    const FRAME_SIZE_IN_SECONDS = FRAME_SIZE / this.samplesPerSecond;
    const FRAME_SIZE_IN_MILLISECONDS = FRAME_SIZE_IN_SECONDS * SECONDS_TO_MILLISECONDS_MULTIPLIER;

    let oldReadPointer = this.readPointer;
    let newReadPointer;

    // Check if Read Pointer is too old
    const READ_POINTER_TOO_OLD =
      READ_WRITE_TIME_DIFFERENCE >= this.bufferLengthInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER;
    if (READ_POINTER_TOO_OLD) {
      return this.calculateTooOldReadPointers(SECONDS_TO_MILLISECONDS_MULTIPLIER);
    }

    // Check if Read Pointer is too close to Write Pointer
    const READ_POINTER_TOO_CLOSE = READ_WRITE_TIME_DIFFERENCE <= FRAME_SIZE_IN_MILLISECONDS;
    if (READ_POINTER_TOO_CLOSE) {
      const REMAINING_NEW_SAMPLES = Math.floor(
        READ_WRITE_TIME_DIFFERENCE / FRAME_SIZE_IN_MILLISECONDS,
      );
      newReadPointer = (oldReadPointer + REMAINING_NEW_SAMPLES) % this.totalBufferSize;
      this.audioChunksRead += REMAINING_NEW_SAMPLES;
      return [oldReadPointer, newReadPointer];
    }

    // All other cases
    newReadPointer = (oldReadPointer + AMOUNT_OF_SAMPLES_TO_READ) % this.totalBufferSize;
    this.audioChunksRead += AMOUNT_OF_SAMPLES_TO_READ;

    return [oldReadPointer, newReadPointer];
  }

  /**
   * Calculates the new read pointers if the read pointer is too old.
   * @param SECONDS_TO_MILLISECONDS_MULTIPLIER - The multiplier used to convert seconds to milliseconds.
   * @returns {number[]} - The new read pointers.
   */
  calculateTooOldReadPointers(SECONDS_TO_MILLISECONDS_MULTIPLIER) {
    const newReadPointer =
      this.writePointer - this.totalBufferSize + this.safetyMarginInSeconds * this.samplesPerSecond;
    const oldReadPointer = (newReadPointer - this.samplesPerSecond) % this.totalBufferSize;
    const ABSOLUTE_BUFFER_START =
      this.absoluteWriteTimeInMilliseconds -
      this.bufferLengthInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER;
    this.setNewAbsoluteReadTime(
      ABSOLUTE_BUFFER_START + this.safetyMarginInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER,
    );
    return [oldReadPointer, newReadPointer];
  }

  /**
   * Forms the output data array, that is to be written to the output using the read pointers.
   * @param oldReadPointer - The old read pointer
   * @param newReadPointer - The new read pointer.
   * @returns {Float32Array} - The output data array.
   */
  formOutputDataArray(oldReadPointer, newReadPointer) {
    // Check if Target Array overflows buffer end
    if (oldReadPointer > newReadPointer) {
      const FIRST_HALF = this.buffer.subarray(oldReadPointer, this.totalBufferSize);
      const SECOND_HALF = this.buffer.subarray(0, newReadPointer);
      return Float32Array.of(...FIRST_HALF, ...SECOND_HALF);
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
    const SAMPLES_TO_ADVANCE = secondsToAdvance * this.samplesPerSecond;
    this.readPointer = (this.readPointer + SAMPLES_TO_ADVANCE) % this.totalBufferSize;
    const SECONDS_TO_MILLISECONDS_MULTIPLIER = 1000;
    this.setNewAbsoluteReadTime(
      this.absoluteReadTimeInMilliseconds + secondsToAdvance * SECONDS_TO_MILLISECONDS_MULTIPLIER,
    );

    // Keep Read Pointer away from Write Pointer
    if (this.absoluteReadTimeInMilliseconds >= this.absoluteWriteTimeInMilliseconds) {
      this.setNewAbsoluteReadTime(
        this.absoluteWriteTimeInMilliseconds -
          this.safetyMarginInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER,
      );
      this.readPointer = this.writePointer - this.safetyMarginInSeconds * this.samplesPerSecond;
    }
  }

  /**
   * Decreases the read pointer by the given amount of seconds.
   * Used for skipping backward in the audio playback.
   * @param secondsToDecrease - The amount of seconds to decrease the read pointer by.
   */
  decreaseReadPointer(secondsToDecrease) {
    const SAMPLES_TO_DECREASE = secondsToDecrease * this.samplesPerSecond;
    this.readPointer = (this.readPointer - SAMPLES_TO_DECREASE) % this.totalBufferSize;
    const SECONDS_TO_MILLISECONDS_MULTIPLIER = 1000;
    this.setNewAbsoluteReadTime(
      this.absoluteReadTimeInMilliseconds - secondsToDecrease * SECONDS_TO_MILLISECONDS_MULTIPLIER,
    );

    // Keep Read Pointer away from End of Buffer
    const END_OF_BUFFER_TIME_TIMESTAMP =
      this.absoluteWriteTimeInMilliseconds -
      this.bufferLengthInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER;
    if (this.absoluteReadTimeInMilliseconds <= END_OF_BUFFER_TIME_TIMESTAMP) {
      this.setNewAbsoluteReadTime(
        END_OF_BUFFER_TIME_TIMESTAMP +
          this.safetyMarginInSeconds * SECONDS_TO_MILLISECONDS_MULTIPLIER,
      );
      this.readPointer =
        this.writePointer -
        this.totalBufferSize +
        this.safetyMarginInSeconds * this.samplesPerSecond;
    }
  }

  /**
   * Broadcast new ReadTime to main thread if it changes.
   * Used for highlighting the current word.
   * @param newReadTimeInMilliseconds - The new read time in seconds.
   */
  setNewAbsoluteReadTime(newReadTimeInMilliseconds) {
    this.absoluteReadTimeInMilliseconds = newReadTimeInMilliseconds;
    this.port.postMessage({
      type: 'newReadTime',
      readTime: newReadTimeInMilliseconds,
    });
  }

  /**
   * Posts the current worklet state to the main thread.
   * Used for cloning current worklet if the sampling rate changes (Playback Speed change)
   */
  postWorkletState() {
    const workletState = {
      buffer: this.buffer,
      bufferLengthInSeconds: this.bufferLengthInSeconds,
      audioPlaying: this.audioPlaying,
      writePointer: this.writePointer,
      readPointer: this.readPointer,
      audioChunksWritten: this.audioChunksWritten,
      audioChunksRead: this.audioChunksRead,
      absoluteReadTimeInSeconds: this.absoluteReadTimeInMilliseconds,
      absoluteWriteTimeInSeconds: this.absoluteWriteTimeInMilliseconds,
      safetyMarginInSeconds: this.safetyMarginInSeconds,
    };
    this.port.postMessage({
      type: 'workletState',
      workletState: workletState,
    });
  }

  /**
   * Sets all state fields of the worklet to the given worklet state.
   * Used to restore a worklet after a sampling rate change.
   * @param workletState - The worklet state to restore.
   */
  setWorkletState(workletState) {
    this.buffer = workletState.buffer;
    this.bufferLengthInSeconds = workletState.bufferLengthInSeconds;
    this.audioPlaying = workletState.audioPlaying;
    this.writePointer = workletState.writePointer;
    this.readPointer = workletState.readPointer;
    this.audioChunksWritten = workletState.audioChunksWritten;
    this.audioChunksRead = workletState.audioChunksRead;
    this.setNewAbsoluteReadTime(workletState.absoluteReadTimeInSeconds);
    this.absoluteWriteTimeInMilliseconds = workletState.absoluteWriteTimeInSeconds;
    this.safetyMarginInSeconds = workletState.safetyMarginInSeconds;
  }
}

registerProcessor('circular-buffer-worklet', CircularBufferWorklet);
