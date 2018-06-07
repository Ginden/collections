import {test} from '../test-runner.mjs';
import {Bag} from "../../dist/index.module.mjs";
import chai from 'chai';
const {expect} = chai;

test('Bag is empty in the begining', () => {
    const instance = new Bag();
    expect(instance.size).to.equal(0);
});

test('Setting size of Bag throws', () => {
    const instance = new Bag();
    try {
        instance.size = 5;
        throw new Error('Setting instance size did not throw');
    } catch(err) {
        expect(err.constructor).to.equal(TypeError);
    }
    expect(instance.size).to.equal(0);
});