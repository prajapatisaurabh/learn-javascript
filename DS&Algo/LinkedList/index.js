// Create Node For LinkList
class Node {
  constructor(data) {
    // Example: new Node(4)
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert at the end of the linked list
  append(data) {
    let node = new Node(data);
    let current;

    // If the list is empty
    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      // Iterate through the list to find the tail
      while (current.next) {
        current = current.next;
      }

      // Append the new node
      current.next = node;
    }

    // Update list size
    this.size++;
  }

  // Print the linked list
  printList() {
    let current = this.head;
    let str = "";

    // Iterate through the list
    while (current) {
      str += current.data + " -> ";
      current = current.next;
    }

    console.log(str);
  }

  // Inset at the beginning of the linked list
  prepend(data) {
    let node = new Node(data);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  // Remove from the beginning of the linked list
  removeFromFront() {
    if (this.head) {
      this.head = this.head.next;
      this.size--;
    }
  }

  // Remove from the end of the linked list
  removeFromEnd() {
    if (this.head) {
      let current = this.head;
      let previous;

      // Iterate through the list
      while (current.next) {
        previous = current;
        current = current.next;
      }

      // Remove the last node
      previous.next = null;
      this.size--;
    }
  }

  // Insert at a specific position in the linked list
  insertAt(data, pos) {
    if (pos >= 0 && pos <= this.size) {
      let node = new Node(data);
      let current = this.head;
      let previous;

      // Iterate through the list
      for (let i = 0; i < pos; i++) {
        previous = current;
        current = current.next;
      }

      // Insert the new node
      node.next = current;
      previous.next = node;
      this.size++;
    }
  }

  // Remove a specific position in the linked list
  removeAt(pos) {
    if (pos >= 0 && pos < this.size) {
      let current = this.head;
      let previous;

      // Iterate through the list
      for (let i = 0; i < pos; i++) {
        previous = current;
        current = current.next;
      }

      // Remove the node
      previous.next = current.next;
      this.size--;
    }
  }

  // Get the size of the linked list
  getSize() {
    return this.size;
  }

  // Clear the linked list
  clear() {
    this.head = null;
    this.size = 0;
  }

  // Check if the linked list is empty
  isEmpty() {
    return this.size === 0;
  }

  // Search for a specific value in the linked list
  search(value) {
    let current = this.head;

    // Iterate through the list
    while (current) {
      if (current.data === value) {
        return true;
      }
      current = current.next;
    }

    return false;
  }

  // Reverse the linked list
  reverse() {
    let current = this.head;
    let previous = null;
    let next;

    // Iterate through the list
    while (current) {
      next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }

    this.head = previous;
  }

  // Sort the linked list
  sort() {
    let current = this.head;
    let previous = null;
    let next;

    // Iterate through the list
    while (current) {
      next = current.next;
      if (previous && previous.data > current.data) {
        previous.next = next;
        this.head = current;
        this.head.next = previous;
        previous = current;
        current = next;
      } else {
        previous = current;
        current = next;
      }
    }
  }

  // Merge two sorted linked lists
  merge(list) {
    let current1 = this.head;
    let current2 = list.head;
    let mergedList = new LinkedList();

    // Iterate through both lists
    while (current1 && current2) {
      if (current1.data < current2.data) {
        mergedList.append(current1.data);
        current1 = current1.next;
      } else {
        mergedList.append(current2.data);
        current2 = current2.next;
      }
    }

    // Append the remaining nodes
    while (current1) {
      mergedList.append(current1.data);
      current1 = current1.next;
    }
    while (current2) {
      mergedList.append(current2.data);
      current2 = current2.next;
    }

    return mergedList;
  }

  // Remove duplicates from the linked list
  removeDuplicates() {
    let current = this.head;
    let previous = null;

    // Iterate through the list
    while (current) {
      let next = current.next;
      if (previous && previous.data === current.data) {
        previous.next = next;
        current = next;
      } else {
        previous = current;
        current = next;
      }
    }
  }

  // Find the middle element of the linked list
  findMiddle() {
    let slow = this.head;
    let fast = this.head;

    // Iterate through the list
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow;
  }

  // Find the nth node from the end of the linked list
  findNthFromEnd(n) {
    let slow = this.head;
    let fast = this.head;

    // Iterate through the list
    for (let i = 0; i < n; i++) {
      fast = fast.next;
    }

    // Iterate through the list
    while (fast) {
      slow = slow.next;
      fast = fast.next;
    }

    return slow;
  }
}

let list = new LinkedList();
list.append(1);
list.removeFromFront();
list.append(2);
list.append(3);
list.prepend(10);
list.removeFromFront();
list.removeFromEnd();

list.printList();
