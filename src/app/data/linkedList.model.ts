import { WordToken } from './wordToken.model';
import { WordExport } from './wordToken.model';

export class LinkedList<T> {
  public head: Node<T> | null = null;
  public tail: Node<T> | null = null;
  public currentIndex: number = 0;

  constructor() {
    this.head = null;
    this.tail = null;
    this.currentIndex = 0;
  }

  public toJSON(): string {
    const elements: T[] = [];
    let current = this.head;

    while (current) {
      elements.push(current.data);
      current = current.next;
    }

    return JSON.stringify(elements);
  }

  public add(data: T) {
    const node = new Node(data);
    node.id = this.currentIndex;
    this.currentIndex++;

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      if (this.tail) {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
      }
    }
  }

  public remove(data: T) {
    let current = this.head;
  
    while (current) {
      if (current.data === data) {
        if (current === this.head) {
          this.head = current.next;
        }
        if (current === this.tail) {
          this.tail = current.prev;
        }
        if (current.prev) {
          current.prev.next = current.next;
        }
        if (current.next) {
          current.next.prev = current.prev;
        }
        return;
      }
      current = current.next;
    }
  }

  public insertAfter(newData: T, prevData: T): void {
    let current = this.head;
  
    while (current) {
      if (current.data === prevData) {
        const newNode = new Node(newData);
        newNode.id = this.currentIndex;
        this.currentIndex++;
        newNode.prev = current;
        newNode.next = current.next;
  
        if (current === this.tail) {
          this.tail = newNode;
        }
  
        current.next = newNode;
  
        if (newNode.next) {
          newNode.next.prev = newNode;
        }
  
        return;
      }
  
      current = current.next;
    }
  }

  public printDataList(): string {
    let current = this.head;
    const data = [];
    while (current) {
      data.push(current.data);
      current = current.next;
    }
    return data.join(" ");
  }

  public size(): number {
    let current = this.head;
    let count = 0;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }

  public toString(): string {
    let current = this.head;
    const elements = [];
    while (current) {
      elements.push(current.data);
      current = current.next;
    }
    return elements.join(" ");
  }
}

export class Node<T> {
  public data: T;
  public id: number = 0;
  public prev: Node<T> | null = null;
  public next: Node<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}
