import {test} from '../test-runner.mjs';
import {Bag} from "../../dist/index.module.mjs";
import chai from 'chai';
const {expect} = chai;

test('Bag#delete - primitive values', () => {
    const instance = new Bag([1, 2, 3]);
    instance
        .delete(1)
        .delete(2);
    const arrayed = [...instance];
    const expected = [3];
    expect(arrayed).to.deep.equal(expected);
    expect(instance.size).to.equal(1);
});

test('Bag#delete - objects', () => {
    const obj1 = {[Math.random()]: Math.random()};
    const obj2 = {[Math.random()]: Math.random()};
    const instance = new Bag([obj1, obj2, obj1]);

    instance
        .delete(obj1);
    const arrayed = [...instance];
    const expected = [obj1, obj2];
    expect(arrayed).to.deep.equal(expected);
    expect(instance.size).to.equal(2);
});
