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
        if (n > this.length) {
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

    filter(callback, thisArg = null) {
        const copy = new LinkedList();
        for (const [i,val] of this.entries()) {
            if (callback.call(thisArg, val, i, this)) {
                copy.push(val);
            }
        }
        return copy;
    }

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
            yield [i,val];
        }
    }


    *_iterate() {
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

    *[Symbol.iterator]() {
        for (const val of this._iterate()) {
            yield val.value;
        }
    }
}
