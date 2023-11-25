import { LinkedList } from '../linkedList/linkedList.model'
import { WordExport } from '../wordToken/wordExport.model'
import { WordToken } from '../wordToken/wordToken.model'
import { SpeechBubbleExport } from './speechBubbleExport.model'

/**
 * Instance of SpeechBubble represents the content of one textbox within the
 * program. Holds a linkedList of words and has itsself a node-structure with previous and next
 * to be integrated into a linkedList itself.
 */
export class SpeechBubble {
    public id: number
    public speaker: number
    public words: LinkedList<WordToken>
    public begin: number
    public end: number

    private static currentId = 0

    public constructor(
        speaker: number,
        begin: number,
        end: number,
        list?: LinkedList<WordToken>,
        id?: number,
    ) {
        if (id != null) {
            this.id = id
        } else {
            this.id = SpeechBubble.getNextId()
        }
        this.speaker = speaker
        if (list) {
            this.words = list
        } else {
            this.words = new LinkedList()
        }
        this.begin = begin
        this.end = end
    }

    /**
     * Returns a new id.
     */
    private static getNextId(): number {
        return SpeechBubble.currentId++
    }

    /**
     * Prints the word-list of this speechbubble.
     */
    public printText(): string {
        let current = this.words.head
        const text = []
        while (current) {
            text.push(current.data.word)
            current = current.next
        }
        return '[' + text.join(', ') + ']'
    }

    /**
     * Returns a String with basic information about this speechbubble.
     */
    public toString(): string {
        return `[${this.id}, ${this.words.size()}, ${this.begin}]`
    }

    /**
     * Returns a wordExportList representing the current word-list of this instance of a speechbubble.
     */
    public toList(): WordExport[] {
        let current = this.words.head
        const wordExportList = []
        while (current) {
            wordExportList.push(current.data.getExport())
            current = current.next
        }
        return wordExportList
    }

    /**
     * Returns an SpeechBubblExport Object for this instance of a speechbubble.
     */
    public getExport(): SpeechBubbleExport {
        return new SpeechBubbleExport(
            this.id,
            this.speaker,
            this.begin,
            this.end,
            this.toList(),
        )
    }

    /**
     * Removes empty Words from the words LinkedList
     */
    public removeEmptyWords(): void {
        let current = this.words.head

        while (current) {
            if (current.data.word !== '') {
                current = current.next
                continue
            }

            if (this.words.tail === current) {
                if (!current.prev) return
                this.words.tail = current.prev
            }

            this.words.remove(current.data)
            current = current.next
        }
    }

    /**
     * Returns the WordToken with the specified id if it exists.
     */
    public getWordTokenById(id: number): WordToken | undefined {
        let current = this.words.head

        while (current) {
            if (current.id === id) {
                return current.data
            }
            current = current.next
        }
        return undefined
    }

    /**
     * Adjusts the fontWeight of all words based on a time stamp.
     *
     * @param audioTime - TimeStamp to give to called function with.
     */
    public adjustWordsFontWeight(audioTime: number) {
        let current = this.words.head
        while (current) {
            current.data.adjustFontWeight(audioTime)
            current = current.next
        }
    }
}
