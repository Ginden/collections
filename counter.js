class Counter {
    constructor(iterable) {
        this._counter = new Map();
    }

    get size() {
        return this._counter.size;
    }

    get _() {
        return (k)=>this.inc(k);
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

    *elements() {
        for (const [key] of this) {
            yield key;
        }
    }

    *[Symbol.iterator]() {
        for (const [key, value] of this._counter.entries()) {
            if (value > 0) {
                yield [key, value];
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

    *mostCommon(k = this.size) {
        const q = [];
        q.length = k;
        k = q.length;
        yield* (Array.from(this).sort(function ([,a], [,b]) {
            return a === b ? 0 : (a>b ? 1:-1);
        }).slice(0, k));
        // TODO: this naive implementation have O(n log n) for any k
        // It can be simplified to O(n log k) at least

    }

}

export default Counter;