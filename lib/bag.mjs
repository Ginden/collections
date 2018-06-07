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
    set size(val){
        throw TypeError();
    }

    forEach(callback, thisArg) {
        let j = 0;
        for(const key of this) {
            Reflect.apply(callback, thisArg, [thisArg, key, j++, this]);
        }
    }

    add(el) {
        const currentCount = this.count(el);
        this[_size] += 1;
        this[_set].set(el, currentCount+1);
        return this;
    }

    delete(el) {
        const count = this.count(el);
        if (count===1) {
            this[_set].delete(el);
        } else {
            this[_set].set(el, count-1);

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


    *[Symbol.iterator]() {
        for(const [key, count] of this[_set]) {
            for(let i =0; i < count; i++) {
                yield key;
            }
        }
    }
}

export default Bag;