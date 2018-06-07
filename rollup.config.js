import esformatter from 'rollup-plugin-esformatter'
import fs from 'fs';
import path from 'path';
import subProcess from 'child_process';

const pkg = require('./package.json');


const fileHash = subProcess.execSync('find lib -type f | sort | xargs cat | sha256sum');
const licenseText = fs.readFileSync(path.join(__dirname, './LICENSE'), 'utf8');
const banner = fs.readFileSync(path.join(__dirname, 'lib/header.txt'), 'utf8')
    .replace('$VERSION', pkg.version)
    .replace('$FILE_HASH', fileHash.slice(0, -4))
    .replace('$LICENSE', licenseText);


const defaultOptions = {
    input: 'lib/index.mjs',
    plugins: [
        esformatter({
            indent: {
                value: '  ',
            },
        })
    ]
};

export default [
    {
        output: {
            format: 'cjs',
            file: 'dist/index.cjs.js',
            interop: false,
            banner
        }
    },
    {
        output: {
            format: 'es',
            file: 'dist/index.module.mjs',
            interop: false,
            banner
        }
    }].map(obj => Object.assign(obj, defaultOptions));
