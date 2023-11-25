import { WordToken } from './wordToken.model'
import { WordExport } from './wordExport.model'

describe('WordExport', () => {
  describe('toJSON', () => {
    it('should return the word export object in JSON format', () => {
      const WORD_EXPORT = new WordExport('test', 0.8, 0, 1, 1)
      const EXPECTED_JSON = {
        Word: 'test',
        Confidence: 0.8,
        StartTime: 0,
        EndTime: 1,
        Speaker: 1,
      }
      expect(WORD_EXPORT.toJSON()).toEqual(EXPECTED_JSON)
    })
  })
  describe('toWordToken', () => {
    it('should return a new WordToken object with the same properties', () => {
      const WORD_EXPORT = new WordExport('test', 0.8, 0, 1, 1)
      const WORDTOKEN = WORD_EXPORT.toWordToken()
      expect(WORDTOKEN.word).toBe('test')
      expect(WORDTOKEN.confidence).toBe(0.8)
      expect(WORDTOKEN.startTime).toBe(0)
      expect(WORDTOKEN.endTime).toBe(1)
      expect(WORDTOKEN.speaker).toBe(1)
    })
  })
})
describe('WordToken', () => {
  describe('setColor', () => {
    it('should set the color to black for confidence >= 0.9', () => {
      const wordToken = new WordToken('test', 0.9, 0, 1, 1)
      wordToken.setColor()
      expect(wordToken.color).toBe('#000000')
    })
    it('should set the color to yellow for 0.7 <= confidence < 0.9', () => {
      const wordToken = new WordToken('test', 0.8, 0, 1, 1)
      wordToken.setColor()
      expect(wordToken.color).toBe('#D09114')
    })
    it('should set the color to orange for 0.5 <= confidence < 0.7', () => {
      const wordToken = new WordToken('test', 0.6, 0, 1, 1)
      wordToken.setColor()
      expect(wordToken.color).toBe('#CC6600')
    })
    it('should set the color to red for confidence < 0.5', () => {
      const wordToken = new WordToken('test', 0.4, 0, 1, 1)
      wordToken.setColor()
      expect(wordToken.color).toBe('#BE0101')
    })
  })
  describe('setWord', () => {
    it('should set the word to a new value', () => {
      const wordToken = new WordToken('test', 0.8, 0, 1, 1)
      wordToken.setWord('new word')
      expect(wordToken.word).toBe('new word')
    })
  })
  describe('getExport', () => {
    it('should return a new WordExport object with the same properties', () => {
      const WORDTOKEN = new WordToken('test', 0.8, 0, 1, 1)
      const WORD_EXPORT = WORDTOKEN.getExport()
      expect(WORD_EXPORT.word).toBe('test')
      expect(WORD_EXPORT.confidence).toBe(0.8)
      expect(WORD_EXPORT.startTime).toBe(0)
      expect(WORD_EXPORT.endTime).toBe(1)
      expect(WORD_EXPORT.speaker).toBe(1)
    })
  })
  describe('updateWordColor', () => {
    it('should update the word color based on the confidence value', () => {
      const wordToken = new WordToken('test', 0.8, 0, 1, 1)
      wordToken.updateWordColor()
      expect(wordToken.confidence).toBe(1)
      expect(wordToken.color).toBe('#000000')
    })
  })
})
