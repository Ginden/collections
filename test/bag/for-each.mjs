import {test} from '../test-runner.mjs';
import {Bag} from "../../dist/index.module.mjs";
import chai from 'chai';

const {expect} = chai;

test('Bag#forEach - basic function', () => {
    const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    const instance = new Bag(arr);
    const expected = arr.reduce((a, b) => a + b);
    let sum = 0;
    instance.forEach((val, i) => {
        sum += val;
    });
    expect(sum, 'sum').to.equal(expected);

});

test('Bag#forEach throws when first argument is not a function', () => {
    const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    const instance = new Bag(arr);
    try {
        instance.forEach(null);
        throw new Error('Dummy error');
    } catch (err) {
        expect(err).to.be.instanceof(TypeError);
    }

});

test('Bag#forEach properly uses second argument as this', () => {
    const arr = ['foo', 'bar'];
    const instance = new Bag(arr);
    const obj = {};
    instance.forEach(function (val) {
        this[val] = 42;
    }, obj);
    expect(obj).to.deep.equal({
        'foo': 42,
        'bar': 42
    });

});

test('Bag#forEach properly provides second argument', () => {
    const arr = [1, 2, 1, 3];
    const expected = [1, 1, 2, 3];
    const instance = new Bag(arr);
    instance.forEach((val, i) => {
        expect(expected[i], `expected[${i}]`).to.equal(val);
    });

});

test('Bag#forEach properly provides instance as third argument', () => {
    const arr = [1, 2, 1, 3];
    const instance = new Bag(arr);
    instance.forEach((ignore, ignore2, bag) => {
        expect(bag).to.equal(instance);
    });

});
