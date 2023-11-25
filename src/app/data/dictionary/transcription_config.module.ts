import { additional_vocab } from './additionalVocab.model'

/**
 * Class representing transcription configuration, including language and additional vocabulary.
 *
 * Attributes and names are taken from Speechmatics Documenation for custom dictionary: https://docs.speechmatics.com/features/custom-dictionary
 */
export class transcription_config {
    language: string
    additional_vocab: additional_vocab[]

    constructor(language: string, additional_vocab: additional_vocab[]) {
        //aus docs.speechmatics/../custom dictionary: "You can specify up to 1000 words or phrases (per job) in your Custom Dictionary"
        if (additional_vocab.length > 1000) {
            throw new Error(
                'additional_vocab array cannot exceed 1000 elements.',
            )
        }

        this.language = language
        this.additional_vocab = additional_vocab
    }
}
