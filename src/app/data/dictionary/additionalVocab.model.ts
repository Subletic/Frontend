/**
 * Class representing a single vocabulary item for transcription.
 * 
 * (Name doesn't fit standards because it was supposed to match the expected JSON Format by Speechmatics)
 */
export class additional_vocab {
    content: string;
    sounds_like?: string[];

    constructor(content: string, sounds_like?: string[]) {
        this.content = content;
        this.sounds_like = sounds_like;
    }
}

