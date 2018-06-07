import {test} from '../test-runner.mjs';
import {Bag} from "../../dist/index.module.mjs";
import chai from 'chai';
const {expect} = chai;

test('Add primitive values to Bag', () => {
    const instance = new Bag();
    [3, 1, 2, 1, 2].forEach(v => instance.add(v));
    const arrayed = [...instance];
    const expected = [3, 1, 1, 2, 2];
    expect(arrayed).to.deep.equal(expected);
    expect(instance.size).to.equal(5);
});

test('Add objects to Bag', () => {
    const instance = new Bag();
    const obj1 = {[Math.random()]: Math.random()};
    const obj2 = {[Math.random()]: Math.random()};

    instance
        .add(obj1)
        .add(obj2);
    const arrayed = [obj1, obj2];
    const expected = [obj1, obj2];
    expect(arrayed).to.deep.equal(expected);
    expect(instance.size).to.equal(2);
});