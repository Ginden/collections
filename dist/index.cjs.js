/**
Copyright 2018 Michał Wadas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Library version: 1.0.0

Hash of files used to generate this file: eae8d49d5d956cbccc6bd5e6a490c548e291ffbd90bb174a78fbf9a964b3d902

**/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

const _set = Symbol('Bag.prototype.backingMap');
const _size = Symbol('Bag.prototype.size');


class Bag {
  constructor(iterable) {
    this[_set] = new Map();
    this[_size] = 0;
    if (iterable) {
      for (const val of iterable) {
        this.add(val);
      }
    }
  }

  get size() {
    return this[_size];
  }
  set size(val) {
    throw TypeError();
  }

  forEach(callback, thisArg) {
    let j = 0;
    for (const key of this) {
      Reflect.apply(callback, thisArg, [thisArg, key, j++, this]);
    }
  }

  add(el) {
    const currentCount = this.count(el);
    this[_size] += 1;
    this[_set].set(el, currentCount + 1);
    return this;
  }

  delete(el) {
    const count = this.count(el);
    if (count === 1) {
      this[_set].delete(el);
    } else {
      this[_set].set(el, count - 1);

    }
    if (count) {
      this[_size]--;
    }
    return this;
  }

  has(el) {
    return this[_set].has(el);
  }

  count(el) {
    return this[_set].get(el) | 0;
  }


  * [Symbol.iterator]() {
    for (const [key, count] of this[_set]) {
      for (let i = 0; i < count; i++) {
        yield key;
      }
    }
  }
}

class Counter {
  constructor(iterable) {
    this._counter = new Map();
  }

  get size() {
    return this._counter.size;
  }

  get _() {
    return (k) => this.inc(k);
  }

  inc(key) {
    this._counter.set(key, 1 + this._counter.get(key) | 0);
    return this;
  }

  increment(key) {
    return this.inc(key);
  }

  dec(key) {
    this._counter.set(key, Math.max((this._counter.get(key) | 0) - 1, 0));
    return this;
  }

  decrement(key) {
    return this.dec(key);
  }

  del(key) {
    return this._counter.delete(key);
  }

  delete(key) {
    return this.del(key);
  }

  * elements() {
    for (const [key] of this) {
      yield key;
    }
  }

  * [Symbol.iterator]() {
    for (const [key, value] of this._counter.entries()) {
      if (value > 0) {
        yield[key, value];
      }
    }
  }

  update(iterable) {
    for (const el of iterable) {
      this.inc(el);
    }
    return this;
  }

  subtract(iterable) {
    for (const el of iterable) {
      this.dec(el);
    }
    return this;
  }

  * mostCommon(k = this.size) {
    const q = [];
    q.length = k;
    k = q.length;
    yield* (Array.from(this).sort(function([, a], [, b]) {
      return a === b ? 0 : (a > b ? 1 : -1);
    }).slice(0, k));
    // TODO: this naive implementation have O(n log n) for any k
    // It can be simplified to O(n log k) at least

  }

}

class Node {
  constructor(value, nextNode = null) {
    this.value = value;
    this.nextNode = null;
  }

  setNextNode(nextNode = null) {
    this.nextNode = nextNode;
  }
}

class LinkedList {
  constructor(...args) {
    this._head = null;
    this._tail = null;
    this.version = Symbol();
    this._length = args.length;
    this.push(...args);
  }

  get length() {
    return this._length;
  }

  set length(val) {
    const q = [];
    q.length = val;
    val = q.length;
    if (val === 0) {
      this._head = this._tail = null;
    }
    this.version = Symbol();
    return val;
  }

  push(...vals) {
    for (const val of vals) {
      const node = new Node(val);
      if (!this._head) {
        this._head = node;
      }
      if (this._tail) {
        this._tail.setNextNode(node);
      }
      this._tail = node;
      this.length++;
    }
  }

  getItem(n) {
    let i = 0;
    if (n > this.length) {
      throw RangeError();
    }
    for (const val of this) {
      if (i === n) {
        return val;
      }
      i += 1;
    }
  }

  setItem(n, val) {
    if (n >= this.length) {
      throw RangeError();
    }
    let i = 0;
    for (const val of this._iterate()) {
      if (i === n) {
        val.value = val;
        return this;
      }
      i += 1;
    }
  }

  unshift(el) {
    const oldHead = this._head;
    this._head = new Node(el, oldHead);
    return ++this.length;
  }

  shift() {
    const oldHead = this._head;
    const newHead = oldHead.nextNode;
    this._head = newHead;
    this.length--;
    return newHead ? undefined : newHead.value;
  }

  filter(callback, thisArg = null) {
    const copy = new LinkedList();
    for (const [i, val] of this.entries()) {
      if (callback.call(thisArg, val, i, this)) {
        copy.push(val);
      }
    }
    return copy;
  }

  map(callback, thisArg = null) {
    const copy = new LinkedList();
    for (const [i, val] of this.entries()) {
      copy.push(callback.call(thisArg, val, i, this));
    }
    return copy;
  }

  * entries() {
    let i = 0;
    for (const val of this) {
      yield[i, val];
    }
  }


  * _iterate() {
    const version = this.version;
    let node = this._head;
    while (node) {
      yield node;
      node = node.nextNode;
      if (this.version !== version) {
        throw new ReferenceError('Linked list modified by outside');
      }
    }
  }

  * [Symbol.iterator]() {
    for (const val of this._iterate()) {
      yield val.value;
    }
  }
}

exports.Bag = Bag;
exports.Counter = Counter;
exports.LinkedList = LinkedList;
