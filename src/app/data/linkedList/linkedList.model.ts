import { Node } from './node.model';

/**
 * Data Structure representing the linkedList concept in datastructures.
 */
export class LinkedList<T> {
  public head: Node<T> | null = null;
  public tail: Node<T> | null = null;
  public currentIndex: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.currentIndex = 0;
  }

  /**
   * Converts the linked list into a JSON-formatted string, using the provided
   * data extraction function to transform the data within each element.
   *
   * @param getDataFunction - A function to extract data from the elements in the list.
   * @returns A JSON-formatted string containing the extracted data from the list.
   */
  public toJSON<U>(getDataFunction: (data: T) => U): string {
    const elements: U[] = [];
    let current = this.head;

    while (current) {
      const DATA = getDataFunction(current.data);
      elements.push(DATA);
      current = current.next;
    }

    return JSON.stringify(elements);
  }

  /**
   * Adds a new Node to the end of the LinkedList
   *
   * @param data - The data attribute given to the new node
   */
  public add(data: T): void {
    const node = new Node(data);
    node.id = this.currentIndex;
    this.currentIndex++;

    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }
    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
  }

  /**
   * Removes a node from the linkedList. Node for removal is identified by input data.
   *
   * @param data - The data attribute which should be searched for for deletion
   */
  public remove(data: T): void {
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

  /**
   * Inserts a new node after a specified node in the linked list.
   * @param {T} newData - The data for the new node to insert.
   * @param {T} prevWord - The data of the node after which the new node should be inserted.
   */
  public insertAfter(newData: T, prevData: T): void {
    let current = this.head;

    while (current) {
      if (current.data !== prevData) {
        current = current.next;
        continue;
      }

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
  }

  /**
   * Generates a formatted string by iterating through the linked list and using the provided
   * data extraction function to transform the data within each element. The extracted data
   * is then joined into a single string with a space delimiter.
   *
   * @param getDataFunction - A function to extract data from the elements in the list.
   * @returns A string containing the extracted and formatted data from the list.
   */
  public printDataList<U>(getDataFunction: (data: T) => U): string {
    let current = this.head;
    const data = [];
    while (current) {
      data.push(getDataFunction(current.data));
      current = current.next;
    }
    return data.join(' ');
  }

  /**
   * Returns the number of elements in the linked list, indicating its size.
   *
   * @returns The number of elements in the linked list.
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
   * Converts the linked list into a formatted string by iterating through the elements
   * and converting each element's data to a string. The elements are then joined into
   * a single string with a space delimiter.
   *
   * @returns A string containing the formatted representation of the linked list.
   */
  public toString(): string {
    let current = this.head;
    const elements = [];
    while (current) {
      elements.push(current.data);
      current = current.next;
    }
    return elements.join(' ');
  }

  /**
   * Retrieves the identifier (id) associated with a specific data element within the linked list.
   *
   * @param data - The data element for which the identifier is requested.
   * @returns The identifier (id) of the specified data element, or null if not found.
   */
  public getNodeId(data: T): number | null {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return current.id;
      }
      current = current.next;
    }
    return null;
  }

  /**
   * Finds data in the linkedList by the ID of its Node.
   * @param {number} id - The ID of the word to find.
   * @returns {T|null} - The found data or null if not found.
   */
  public getDataById(id: number): T | null {
    let current = this.head;
    while (current) {
      if (current.id === id) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }
}
