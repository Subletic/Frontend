import { transcription_config } from "./transcription_config.module";

/**
 * Class representing a dictionary containing transcription configuration.
 */
export class dictionary {

    transcription_config: transcription_config;

    constructor(transcription_config: transcription_config) {
        this.transcription_config = transcription_config;
    }

    sortAlphabetically(): void {
        this.transcription_config.additional_vocab.sort((a, b) => {
            const contentA = a.content.toLowerCase();
            const contentB = b.content.toLowerCase();

            if (contentA < contentB) {
                return -1;
            }
            if (contentA > contentB) {
                return 1;
            }
            return 0;
        });
    }

    sortReverseAlphabetically(): void {
        this.transcription_config.additional_vocab.sort((a, b) => {
            const contentA = a.content.toLowerCase();
            const contentB = b.content.toLowerCase();

            if (contentA > contentB) {
                return -1;
            }
            if (contentA < contentB) {
                return 1;
            }
            return 0;
        });
    }
}