import { LinkedList } from '../linkedList/linkedList.model'
import { WordToken } from '../wordToken/wordToken.model'
import { WordExport } from '../wordToken/wordExport.model'
import { SpeechBubble } from './speechBubble.model'

/**
 * SpeechBubbleExport represents the important information about
 * an instance of speechbubble that can be transfered to JSON. This JSON
 * Object can then be send to backend.
 */
export class SpeechBubbleExport {
    public id: number
    public speaker: number
    public startTime: number
    public endTime: number
    public speechBubbleContent: WordExport[]

    constructor(
        id: number,
        speaker: number,
        begin: number,
        end: number,
        speechBubbleContent: WordExport[],
    ) {
        this.id = id
        this.speaker = speaker
        this.startTime = begin
        this.endTime = end
        this.speechBubbleContent = speechBubbleContent
    }

    /**
     * Returns the information about the attributes of this instance
     * into the by the backend expected format.
     *
     */
    public toJSON() {
        return {
            Id: this.id,
            Speaker: this.speaker,
            StartTime: this.startTime,
            EndTime: this.endTime,
            SpeechBubbleContent: this.speechBubbleContent.map((wordExport) =>
                wordExport.toJSON(),
            ),
        }
    }

    /**
     * Transforms an instance of SpeechBubbleExport into a SpeechBubble.
     *
     */
    public toSpeechBubble(): SpeechBubble {
        const words = new LinkedList<WordToken>()

        this.speechBubbleContent.forEach((element) => {
            words.add(element.toWordToken())
        })

        return new SpeechBubble(
            this.speaker,
            this.startTime,
            this.endTime,
            words,
            this.id,
        )
    }
}
