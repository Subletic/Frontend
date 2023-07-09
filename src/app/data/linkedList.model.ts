import { WordToken } from './wordToken.model';
import { WordExport } from './wordToken.model';

//Für die Zukunft: LinkedList mergen zu einer, dieses mal "LinkedList<T>", Problem: Attribute von T?

/**
 * Data Structure similiar to the linkedList concept in datastructures.
 * Typescript is missing an implementation of a LinkedList
 * 
 * Instead of nodes, this data structure holds the specific objects and these have the next and previous attributes needed
 */
export class LinkedList {
  public head: WordToken | null;
  public tail: WordToken | null;
  public currentIndex: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.currentIndex = 0;
  }

  /**
   * Returns a String in form of a json object containing data for this object.
   */
  public toJSON(): string {
    const wordExports: WordExport[] = [];
    let current = this.head;
  
    while (current) {
      wordExports.push(current.getExport());
      current = current.next;
    }
  
    return JSON.stringify(wordExports);
  }
  

  /**
   * Adds a new WordToken to the linkedList
   * 
   * @param word - The new word to add
   */
  public add(word: WordToken) {
    word.id = this.currentIndex;
    this.currentIndex++;

    if (!this.head) {
      this.head = word;
      this.tail = word;
    } else {
      if (this.tail) {
        this.tail.next = word;
        word.prev = this.tail;
        this.tail = word;
      }
    }
  }

  /**
   * Removes a certain word from the linkedList
   * 
   * @param - The word to remove
   */
  public remove(word: WordToken) {
    if (word === this.head) {
      this.head = word.next;
    }
    if (word === this.tail) {
      this.tail = word.prev;
    }
    if (word.prev) {
      word.prev.next = word.next;
    }
    if (word.next) {
      word.next.prev = word.prev;
    }
  }

  /** 
   * Prints the words attribute of this instance.
   */
  public printWordList() {
    let current = this.head;
    const words = [];
    while (current) {
      words.push(current.word);
      current = current.next;
    }
    return words.join(" ");
  }

  /**
   * Returns the size of this instance, similiar to length() or size() of similiar data structures
   */
  public size(): number {
    let current = this.head;
    let count = 0;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }

  /**
   * Returns a string version of the elements of this linkedList
   */
  public toString() {
    let current = this.head;
    const elements = [];
    while (current) {
      elements.push(current.word);
      current = current.next;
    }
    return elements.join(" ");
  }
}