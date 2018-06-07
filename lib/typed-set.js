export default function constructType(keyType) {
    return class TypedSet extends Set {
        add(key) {
            if (typeof keyType == "string") {
                assertType(key, keyType);
            } else if (typeof keyType === 'function') {
                assertInstanceOf(key, keyType);
            }
            super.add(key);
        }
        has(key) {
            if (typeof keyType == "string") {
                assertType(key, keyType);
            } else if (typeof keyType === 'function') {
                assertInstanceOf(key, keyType);
            }
            super.has(key);
        }
    }
}

function assertType(obj, type) {
    if (typeof obj !== type) {
        throw new TypeError('Expected ' + type + ', got: ' + typeof obj);
    }
}

function assertInstanceOf(obj, constructor) {
    if (!(obj instanceof  constructor)) {
        throw new TypeError('Expected instance of ' + constructor + ', got:' + ({}).toString.call(obj));
    }
}