import {test} from '../test-runner.mjs';
import {Bag} from "../../dist/index.module.mjs";
import chai from 'chai';
const {expect} = chai;

test('Bag#size - starts from 0', () => {
    const instance = new Bag();
    expect(instance.size).to.equal(0);
});

test('Bag#size - setting it throws', () => {
    const instance = new Bag();
    try {
        instance.size = 5;
        throw new Error('Setting instance size did not throw');
    } catch(err) {
        expect(err.constructor).to.equal(TypeError);
    }
    expect(instance.size).to.equal(0);
});

test('Bag#size - updates on .add', () => {
    const instance = new Bag();
    instance.add(1);
    instance.add(1);
    instance.add(2);
    expect(instance.size).to.equal(3);
});

test('Bag#size - updates on .delete', () => {
    const instance = new Bag();
    instance
        .add(1)
        .add(1)
        .delete(1)
        .add(2);
    expect(instance.size).to.equal(2);
});
