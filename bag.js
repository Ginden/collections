class Bag {
    constructor(iterable) {
        this._set = new Map();
        this._size = 0;
        if (iterable) {
            for (const val of this._set) {
                this._set.set(val, 1+this._set.get(val)|0);
                this._size++;
            }
        }
    }

    get size() {
        return this._size;
    }
    set size(val){
        throw TypeError();
    }

    forEach(callback, thisArg) {
        let j = 0;
        for(const key of this) {
            callback.call(thisArg, key, j++, this);
        }
    }

    add(el) {
        this._set.set(el, 1+this._set.get(el)|0 );
    }

    remove(el) {
        const count = this.count(el);
        if (count===1) {
            this._set.delete(el);
        } else {
            this._set.set(el, count-1);

        }
        if (count) {
            this._size--;
        }
        return this;
    }

    delete(el) {
        return this.remove(el);
    }

    has(el) {
        return this._set.has(el);
    }

    count(el) {
        return this._set.get(el) | 0;
    }


    *[Symbol.iterator]() {
        for(const [key, count] of this._set) {
            for(let i =0; i < count; i++) {
                yield key;
            }
        }
    }
}

export default Bag;