/**
 * Represents a node in a doubly-linked list, containing data of type T.
 *
 * @template T - The data type stored in the node.
 */

export class Node<T> {
  public data: T
  public id: number
  public prev: Node<T> | null = null
  public next: Node<T> | null = null

  constructor(data: T) {
    this.data = data
    this.id = 0
  }
}
