import chalk from 'chalk';

const tests = [];

const _fn = Symbol();
const doNothing = () => Promise.resolve();
const {
    red,
    green,
    greenBright
} = chalk;

class Promise extends global.Promise {
    /*
    Copied from https://github.com/matthew-andrews/Promise.prototype.finally/blob/master/finally.js
     */
    finally(callback) {
        const Ctor = this.constructor;

        return this.then(
            value => Ctor.resolve(callback()).then(() => value),
            reason => Ctor.resolve(callback()).then(() => {
                throw reason;
            }));
    }

}

class SingleTest {
    constructor(name, fn) {
        this.name = name;
        this[_fn] = fn;
    }

    after(fn) {
        this.cleanup = fn;
        return this;
    }

    before(fn) {
        this.prepare = fn;
        return this;
    }

    get run() {
        return () => {
            const startTime = Date.now();
            const {name} = this;
            return Promise.resolve()
                .then(this[_fn])
                .then(() => {
                    return {
                        name,
                        error: null,
                        time: Date.now() - startTime
                    };
                })
                .catch(error => {
                    return {
                        name,
                        error,
                        time: Date.now() - startTime
                    }
                });
        }
    }


}

export function test(name, fn) {
    const test = new SingleTest(name, fn);
    tests.push(test);
    void runTests();
    return test;
}

let isRunning = false;

async function runTests() {
    if (isRunning) return;
    isRunning = true;
    let test;
    await new Promise(resolve => setTimeout(resolve, 1));
    tests.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    while (test = tests.shift()) {
        await Promise.resolve()
            .then(test.prepare || doNothing)
            .then(test.run)
            .finally(test.cleanup || doNothing)
            .then(report)
    }


}


function report(testResult) {
    const {
        name,
        time,
        error
    } = testResult;
    if (error) {
        console.error(red(`  ✖ ${name} (${formatTime(time)})
  ${formatError(error)}`));
        process.exitCode = 1;
    } else {
        console.error(green(`  ✔ ${name} (${formatTime(time)})`));

    }
}


function formatTime(ms) {
    return greenBright(ms
        .toFixed(1)
        .replace('.0', '')
        .concat('ms'));
}

function formatError(err) {
    return err.stack.split('\n').map(line => `    ${line}`).join('\n');
}
