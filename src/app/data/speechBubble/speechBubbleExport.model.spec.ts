import { WordExport } from '../wordToken/wordExport.model'
import { SpeechBubbleExport } from './speechBubbleExport.model'

describe('SpeechBubbleExport', () => {
    let wordExport1: WordExport
    let wordExport2: WordExport
    let speechBubbleExport: SpeechBubbleExport

    beforeEach(() => {
        wordExport1 = new WordExport('Hello', 0.9, 0, 1, 1)
        wordExport2 = new WordExport('World', 0.8, 2, 3, 1)
        speechBubbleExport = new SpeechBubbleExport(1, 1, 0, 3, [
            wordExport1,
            wordExport2,
        ])
    })

    it('should correctly initialize SpeechBubbleExport instance', () => {
        expect(speechBubbleExport.id).toBe(1)
        expect(speechBubbleExport.speaker).toBe(1)
        expect(speechBubbleExport.startTime).toBe(0)
        expect(speechBubbleExport.endTime).toBe(3)
        expect(speechBubbleExport.speechBubbleContent.length).toBe(2)
        expect(speechBubbleExport.speechBubbleContent[0]).toEqual(wordExport1)
        expect(speechBubbleExport.speechBubbleContent[1]).toEqual(wordExport2)
    })

    it('should convert SpeechBubbleExport instance to JSON', () => {
        const EXPECTED_JSON = {
            Id: 1,
            Speaker: 1,
            StartTime: 0,
            EndTime: 3,
            SpeechBubbleContent: [
                {
                    Word: 'Hello',
                    Confidence: 0.9,
                    StartTime: 0,
                    EndTime: 1,
                    Speaker: 1,
                },
                {
                    Word: 'World',
                    Confidence: 0.8,
                    StartTime: 2,
                    EndTime: 3,
                    Speaker: 1,
                },
            ],
        }

        expect(speechBubbleExport.toJSON()).toEqual(EXPECTED_JSON)
    })
})
