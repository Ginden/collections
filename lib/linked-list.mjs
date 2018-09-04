class Node {
    constructor(value, nextNode = null) {
        this.value = value;
        this.nextNode = null;
    }

    setNextNode(nextNode = null) {
        this.nextNode = nextNode;
    }
}

const _head = Symbol('LinkedList#head');
const _tail = Symbol('LinkedList#_tail');
const _length = Symbol('LinkedList#length');
const _version = Symbol('LinkedList#version');

class LinkedList {
    constructor(...args) {
        this[_head] = null;
        this[_tail] = null;
        this[_version] = Symbol();
        this[_length] = args.length;
        this.push(...args);
    }

    /**
     *
     * @return {number}
     */
    get length() {
        return this[_length];
    }

    /**
     *
     * @param {number} val
     */
    set length(val) {
        const q = [];
        q.length = val;
        val = q.length;
        if (val === 0) {
            this[_head] = this[_tail] = null;
        }
        this[_version] = Symbol();
        return val;
    }


    /**
     *
     * @param {...*} vals
     * @return {number}
     */
    push(...vals) {
        for (const val of vals) {
            const node = new Node(val);
            if (!this[_head]) {
                this[_head] = node;
            }
            if (this[_tail]) {
                this[_tail].setNextNode(node);
            }
            this[_tail] = node;
            this.length++;
        }
        return this.length;
    }

    /**
     *
     * @param {number} n
     * @return {*}
     */
    getItem(n) {
        let i = 0;
        if (n > this.length) {
            throw RangeError();
        }
        for (const val of this) {
            if (i === n) {
                return val.value;
            }
            i += 1;
        }
    }

    /**
     *
     * @param {number} n
     * @param {*} valueToSet
     * @return {LinkedList}
     */
    setItem(n, valueToSet) {
        if (n >= this.length) {
            throw RangeError();
        }
        this[_version] = Symbol();
        let i = 0;
        for (const node of this._iterate()) {
            if (i === n) {
                node.value = valueToSet;
                return this;
            }
            i += 1;
        }
    }

    /**
     *
     * @param {*} el
     * @return {number}
     */
    unshift(el) {
        const oldHead = this[_head];
        this[_head] = new Node(el, oldHead);
        return ++this.length;
    }

    /**
     *
     * @return {undefined|*}
     */
    shift() {
        const oldHead = this[_head];
        const newHead = oldHead.nextNode;
        this[_head] = newHead;
        this.length--;
        return newHead ? undefined : newHead.value;
    }

    /**
     *
     * @param {function} callback
     * @param {object} [thisArg]
     * @return {LinkedList}
     */
    filter(callback, thisArg = null) {
        const copy = new LinkedList();
        for (const [i,val] of this.entries()) {
            if (callback.call(thisArg, val, i, this)) {
                copy.push(val);
            }
        }
        return copy;
    }


    /**
     *
     * @param {function} callback
     * @param {object} [thisArg]
     * @return {LinkedList}
     */
    map(callback, thisArg = null) {
        const copy = new LinkedList();
        for (const [i,val] of this.entries()) {
            copy.push(callback.call(thisArg, val, i, this));
        }
        return copy;
    }

    *entries() {
        let i = 0;
        for(const val of this) {
            yield [i++,val];
        }
    }


    *_iterate() {
        const version = this[_version];
        let node = this[_head];
        while (node) {
            yield node;
            node = node.nextNode;
            if (this[_version] !== version) {
                throw new ReferenceError('Linked list modified by outside');
            }
        }
    }

    *[Symbol.iterator]() {
        for (const val of this._iterate()) {
            yield val.value;
        }
    }
}

export default LinkedList;
