import { SpeechBubble } from '../data/speechBubble/speechBubble.model'
import { SpeechBubbleExport } from '../data/speechBubble/speechBubbleExport.model'
import { WordToken } from '../data/wordToken/wordToken.model'
import { TextSheetComponent } from './textSheet.component'
import { SignalRService } from '../service/signalR.service'
import { LinkedList } from '../data/linkedList/linkedList.model'
import { SpeechBubbleChain } from '../data/speechBubbleChain/speechBubbleChain.module'
import { AudioService } from '../service/audio.service'

describe('LinkedList', () => {
  let linkedList: LinkedList<SpeechBubble>
  let speechBubble1: SpeechBubble
  let speechBubble2: SpeechBubble
  let speechBubble3: SpeechBubble

  beforeEach(() => {
    linkedList = new LinkedList()
    speechBubble1 = new SpeechBubble(0, 0, 0)
    speechBubble2 = new SpeechBubble(1, 1, 1)
    speechBubble3 = new SpeechBubble(2, 2, 2)
  })

  it('should add a speech bubble to the list', () => {
    linkedList.add(speechBubble1)
    expect(linkedList.head?.data).toBe(speechBubble1)
    expect(linkedList.tail?.data).toBe(speechBubble1)
  })

  it('should add multiple speech bubbles to the list', () => {
    linkedList.add(speechBubble1)
    linkedList.add(speechBubble2)
    linkedList.add(speechBubble3)
    expect(linkedList.head?.data).toBe(speechBubble1)
    if (linkedList.head && linkedList.head.next) {
      expect(linkedList.head?.next?.data).toBe(speechBubble2)
      expect(linkedList.head?.next?.next?.data).toBe(speechBubble3)
      expect(linkedList.tail?.data).toBe(speechBubble3)
    }
  })

  it('should remove a speech bubble from the list', () => {
    linkedList.add(speechBubble1)
    linkedList.add(speechBubble2)
    linkedList.add(speechBubble3)
    linkedList.remove(speechBubble2)
    expect(linkedList.head?.data).toBe(speechBubble1)
    if (linkedList.head) {
      expect(linkedList.head.next?.data).toBe(speechBubble3)
    }
    expect(linkedList.tail?.data).toBe(speechBubble3)
  })

  it('should export speech bubbles to JSON', () => {
    const testBubble = new SpeechBubble(0, 0, 0)
    const EXAMPLE_WORD_1 = new WordToken('Testeingabe', 1, 1, 1, 1)
    const EXAMPLE_WORD_2 = new WordToken('weitere', 1, 1, 1, 1)
    testBubble.words.add(EXAMPLE_WORD_1)
    testBubble.words.add(EXAMPLE_WORD_2)
    const TESTBUBBLE_EXPORT = testBubble.getExport()
    const SPEECHBUBBLE_CHAIN = new SpeechBubbleChain([TESTBUBBLE_EXPORT])
    const expectedJson = {
      SpeechbubbleChain: [TESTBUBBLE_EXPORT.toJSON()],
    }
    expect(SPEECHBUBBLE_CHAIN.toJSON()).toEqual(expectedJson)
  })
})

describe('TextSheetComponent', () => {
  let component: TextSheetComponent
  let signalRService: SignalRService
  let audioService: AudioService

  beforeEach(() => {
    signalRService = new SignalRService()
    audioService = new AudioService()
    component = new TextSheetComponent(signalRService, audioService)
    component.speechBubbles = new LinkedList<SpeechBubble>()
  })

  it('should initialize with a speech bubble', () => {
    expect(component.speechBubbles.head).toBeDefined()
  })

  it('should return an array of speech bubbles', () => {
    const SPEECHBUBBLES = component.getSpeechBubblesArray()
    if (component.speechBubbles.head == null) return
    expect(SPEECHBUBBLES).toEqual([component.speechBubbles.head.data])
  })

  it('should remove a speech bubble', () => {
    const INITIAL_LENGTH = component.getSpeechBubblesArray().length

    const NEW_SPEECHBUBBLE = new SpeechBubble(0, 0, 0)
    component.speechBubbles.add(NEW_SPEECHBUBBLE)

    component.deleteSpeechBubble(NEW_SPEECHBUBBLE.id)

    const speechBubbles = component.getSpeechBubblesArray()
    expect(speechBubbles.length).toBe(INITIAL_LENGTH)
    expect(speechBubbles).not.toContain(NEW_SPEECHBUBBLE)
  })

  it('should retrieve the correct speech bubble by id', () => {
    const TEST_SPEECHBUBBLE_1 = new SpeechBubble(1, 1, 1)
    const TEST_SPEECHBUBBLE_2 = new SpeechBubble(2, 2, 2)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_1)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_2)

    const SPEECHBUBBLE_WITH_ID_1 = component.getSpeechBubbleById(
      TEST_SPEECHBUBBLE_1.id,
    )
    const SPEECHBUBBLE_WITH_ID_2 = component.getSpeechBubbleById(
      TEST_SPEECHBUBBLE_2.id,
    )
    const SPEECHBUBBLE_WITH_ID_999 = component.getSpeechBubbleById(999) // Non-existent id

    expect(SPEECHBUBBLE_WITH_ID_1).toBe(TEST_SPEECHBUBBLE_1)
    expect(SPEECHBUBBLE_WITH_ID_2).toBe(TEST_SPEECHBUBBLE_2)
    expect(SPEECHBUBBLE_WITH_ID_999).toBeUndefined()
  })

  it('should call the exportToJson method with the correct speech bubble when calling callExportToJson', () => {
    const TEST_SPEECHBUBBLE = new SpeechBubble(1, 1, 1)
    component.speechBubbles.add(TEST_SPEECHBUBBLE)

    spyOn(component, 'exportToJson')

    component.callExportToJson(TEST_SPEECHBUBBLE.id)

    expect(component.exportToJson).toHaveBeenCalledWith([
      TEST_SPEECHBUBBLE.getExport(),
    ])
  })

  it('should retrieve an array of all speech bubbles', () => {
    const TEST_SPEECHBUBBLE_1 = new SpeechBubble(1, 1, 1)
    const TEST_SPEECHBUBBLE_2 = new SpeechBubble(2, 2, 2)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_1)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_2)

    const speechBubbles = component.getSpeechBubblesArray()

    expect(speechBubbles).toEqual([TEST_SPEECHBUBBLE_1, TEST_SPEECHBUBBLE_2])
  })

  it('should delete a speech bubble from the speechBubbles list based on the id', () => {
    const TEST_SPEECHBUBBLE_1 = new SpeechBubble(1, 1, 1)
    const TEST_SPEECHBUBBLE_2 = new SpeechBubble(2, 2, 2)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_1)
    component.speechBubbles.add(TEST_SPEECHBUBBLE_2)

    component.deleteSpeechBubble(TEST_SPEECHBUBBLE_1.id)

    expect(component.speechBubbles.size()).toBe(1)
    expect(component.speechBubbles.head?.data).toBe(TEST_SPEECHBUBBLE_2)
  })

  it('should not import from invalid speechBubbleChain object', () => {
    spyOn(console, 'error')
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined)
    const SPEECHBUBBLE_DTO_NULL: SpeechBubbleExport[] = []
    component.importfromJson(SPEECHBUBBLE_DTO_NULL)
    expect(console.error).toHaveBeenCalledWith(
      'Invalid speechBubbleChain object.',
    )
  })

  it('should return early if speechBubble is falsy', () => {
    // Arrange
    const ID = 1
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined)
    spyOn(window, 'clearInterval')
    spyOn(component, 'timeSinceFocusOutCounter')

    // Act
    component.onFocusOut(ID)

    // Assert
    expect(component.getSpeechBubbleById).toHaveBeenCalledWith(ID)
    expect(window.clearInterval).not.toHaveBeenCalled()
    expect(component.timeSinceFocusOutCounter).not.toHaveBeenCalled()
  })

  it('should return early if speechBubbleToExport is falsy', () => {
    // Arrange
    const ID = 1
    spyOn(component, 'getSpeechBubbleById').and.returnValue(undefined)
    spyOn(component, 'exportToJson')

    // Act
    component.callExportToJson(ID)

    // Assert
    expect(component.getSpeechBubbleById).toHaveBeenCalledWith(ID)
    expect(component.exportToJson).not.toHaveBeenCalled()
  })

  it('should start a timer and call callExportToJson after 5 seconds of inactivity', () => {
    // Arrange
    jasmine.clock().install()
    const ID = 1
    let callExportToJsonCalled = false
    spyOn(component, 'callExportToJson').and.callFake(() => {
      callExportToJsonCalled = true
    })

    // Act
    component.timeSinceFocusOutCounter(ID)

    // Fast-forward time by 5 seconds
    jasmine.clock().tick(5000)

    // Assert
    expect(callExportToJsonCalled).toBe(false)

    // Clean up
    jasmine.clock().uninstall()
  })

  it('should adjust word font weight for speech bubbles at the given audio time', () => {
    const speechBubble1 = new SpeechBubble(
      1,
      0,
      6,
      new LinkedList<WordToken>(),
      0,
    )
    const speechBubble2 = new SpeechBubble(
      2,
      6.01,
      12,
      new LinkedList<WordToken>(),
      1,
    )
    const WORD_1 = new WordToken('Hallo', 1, 0, 2, 1)
    const WORD_2 = new WordToken('an', 1, 2.01, 4, 1)
    const WORD_3 = new WordToken('Welt', 1, 4.01, 6, 1)

    const WORD_4 = new WordToken('Hallo', 1, 6.01, 9, 1)
    const WORD_5 = new WordToken('Zurück!', 1, 6.01, 12, 1)

    WORD_1.fontWeight = 'normal'
    WORD_2.fontWeight = 'normal'
    WORD_3.fontWeight = 'normal'
    WORD_4.fontWeight = 'normal'
    WORD_5.fontWeight = 'normal'

    speechBubble1.words.add(WORD_1)
    speechBubble1.words.add(WORD_2)
    speechBubble1.words.add(WORD_3)
    speechBubble2.words.add(WORD_4)
    speechBubble2.words.add(WORD_5)

    component.speechBubbles.add(speechBubble1)
    component.speechBubbles.add(speechBubble2)

    const AUDIOTIME = 1.5

    const adjustWordsFontWeightSpy1 = spyOn(
      speechBubble1,
      'adjustWordsFontWeight',
    )
    const adjustWordsFontWeightSpy2 = spyOn(
      speechBubble2,
      'adjustWordsFontWeight',
    )

    component.fontWeightForSpeechBubblesAt(AUDIOTIME)

    expect(adjustWordsFontWeightSpy1).toHaveBeenCalledWith(AUDIOTIME)
    expect(adjustWordsFontWeightSpy2).not.toHaveBeenCalled()

    //expect(speechBubble1.words.head?.data.fontWeight).toBe('bold');
    expect(speechBubble1.words.head?.next?.data.fontWeight).toBe('normal')
    expect(speechBubble1.words.head?.next?.next?.data.fontWeight).toBe('normal')
    expect(speechBubble2.words.head?.data.fontWeight).toBe('normal')
    expect(speechBubble2.words.head?.next?.data.fontWeight).toBe('normal')
  })
})
