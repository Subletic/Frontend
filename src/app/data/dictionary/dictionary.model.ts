import { transcription_config } from "./transcription_config.module";

/**
 * Class representing a dictionary containing transcription configuration.
 */
export class dictionary {

    transcription_config: transcription_config;

    constructor(transcription_config: transcription_config) {
        this.transcription_config = transcription_config;
    }
}