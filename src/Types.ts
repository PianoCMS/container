// deno-lint-ignore-file
//from poppinss/utils v.4.0.2
// @ts-nocheck: imported libs from nodejs
//@ts-ignore: imported libs from nodejs

export type possibleTypes = 
    | 'undefined'
    | 'null'
    | 'boolean'
    | 'buffer'
    | 'number'
    | 'string'
    | 'arguments'
    | 'object'
    | 'date'
    | 'array'
    | 'regexp'
    | 'error'
    | 'function'
    | 'class'
    | 'promise'
    | 'generatorfunction'
    | 'symbol'
    | 'map'
    | 'weakmap'
    | 'set'
    | 'weakset'
    | 'int8array'
    | 'uint8array'
    | 'uint8clampedarray'
    | 'int16array'
    | 'uint16array'
    | 'int32array'
    | 'uint32array'
    | 'float32array'
    | 'mapiterator'
    | 'setiterator'
    | 'stringiterator'
    | 'arrayiterator'
    | 'float64array';
function kindOf(val: any):possibleTypes {
    if (val === void 0) return 'undefined';
    if (val === null) return 'null';

    const type = typeof val;
    if (type === 'boolean') return 'boolean';
    if (type === 'string') return 'string';
    if (type === 'number') return 'number';
    if (type === 'symbol') return 'symbol';
    if (type === 'function') {
        return isGenerator(val) ? 'generatorfunction' : 'function';
    }

    if (isArray(val)) return 'array';
    if (isBuffer(val)) return 'buffer';
    if (isArguments(val)) return 'arguments';
    if (isDate(val)) return 'date';
    if (isError(val)) return 'error';
    if (isRegexp(val)) return 'regexp';

    switch (ctorName(val)) {
        case 'Symbol': return 'symbol';
        case 'Promise': return 'promise';

        // Set, Map, WeakSet, WeakMap
        case 'WeakMap': return 'weakmap';
        case 'WeakSet': return 'weakset';
        case 'Map': return 'map';
        case 'Set': return 'set';

        // 8-bit typed arrays
        case 'Int8Array': return 'int8array';
        case 'Uint8Array': return 'uint8array';
        case 'Uint8ClampedArray': return 'uint8clampedarray';

        // 16-bit typed arrays
        case 'Int16Array': return 'int16array';
        case 'Uint16Array': return 'uint16array';

        // 32-bit typed arrays
        case 'Int32Array': return 'int32array';
        case 'Uint32Array': return 'uint32array';
        case 'Float32Array': return 'float32array';
        case 'Float64Array': return 'float64array';
    }

    if (isGeneratorObj(val)) {
        return 'generatorfunction';
    }

    // Non-plain objects
    const newType = toString.call(val);
    switch (newType) {
        case '[object Object]': return 'object';
        // iterators
        case '[object Map Iterator]': return 'mapiterator';
        case '[object Set Iterator]': return 'setiterator';
        case '[object String Iterator]': return 'stringiterator';
        case '[object Array Iterator]': return 'arrayiterator';
    }

    // other
    return type.slice(8, -1).toLowerCase().replace(/\s/g, '') as possibleTypes;
};

function ctorName(val: any): string {
    return typeof val.constructor === 'function' ? val.constructor.name : null;
}

export function isArray(val: any): boolean {
    if (Array.isArray) return Array.isArray(val);
    return val instanceof Array;
}

export function isError(val: any): boolean {
    return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

export function isDate(val: any): boolean {
    if (val instanceof Date) return true;
    return typeof val.toDateString === 'function'
        && typeof val.getDate === 'function'
        && typeof val.setDate === 'function';
}

export function isRegexp(val: any): boolean {
    if (val instanceof RegExp) return true;
    return typeof val.flags === 'string'
        && typeof val.ignoreCase === 'boolean'
        && typeof val.multiline === 'boolean'
        && typeof val.global === 'boolean';
}

export function isGenerator(val: any): boolean {
    return ctorName(val) === 'GeneratorFunction';
}
export function isGeneratorFn(name: any, val: any): boolean {
    return ctorName(name) === 'GeneratorFunction';
}

export function isGeneratorObj(val: any): boolean {
    return typeof val.throw === 'function'
        && typeof val.return === 'function'
        && typeof val.next === 'function';
}

export function isArguments(val: any): boolean {
    try {
        if (typeof val.length === 'number' && typeof val.callee === 'function') {
            return true;
        }
    } catch (err) {
        if (err.message.indexOf('callee') !== -1) {
            return true;
        }
    }
    return false;
}

export function isBuffer(val: any): boolean {
    if (val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val);
    }
    return false;
}

const toString = Function.prototype.toString

/**
 * Lookup the type for a given value
 */
export function lookup(
    value: any
): possibleTypes {
    const kind = kindOf(value)

    if (kind === 'function' && /^class\s/.test(toString.call(value))) {
        return 'class'
    }

    return kind
}

/**
 * Find if a given value is undefined
 */
export function isUndefined(value: any): value is undefined {
    return lookup(value) === 'undefined'
}

/**
 * Find if a given value is null
 */
export function isNull(value: any): value is null {
    return lookup(value) === 'null'
}

/**
 * Find if a given value is a boolean
 */
export function isBoolean(value: any): value is boolean {
    return lookup(value) === 'boolean'
}

/**
 * Find if a given value is a number
 */
export function isNumber(value: any): value is number {
    return lookup(value) === 'number'
}

/**
 * Find if a given value is a string
 */
export function isString(value: any): value is string {
    return lookup(value) === 'string'
}


/**
 * Find if a given value is a plain object
 */
export function isObject(value: any): boolean {
    return lookup(value) === 'object'
}


/**
 * Find if a given value is a Function
 */
export function isFunction(value: any): value is Function {
    return lookup(value) === 'function'
}

/**
 * Find if a given value is a class. Uses regular expression, since there
 * is no way to natively distinguish a class and a function in Javascript
 */
export function isClass(value: any): boolean {
    return lookup(value) === 'class'
}

/**
 * Find if a value is an integer or not
 */
export function isInteger(value: number): value is number {
    return Number.isInteger(value)
}

/**
 * Find if a value is float value or not. The values with more than
 * zero remainder returns true
 */
export function isFloat(value: number): value is number {
    return value !== (value | 0)
}

/**
 * Find if the value has given decimal place or not.
 *
 * Since there is no direct way in Javascript to check for decimal place. We make
 * use of regex to find it out.
 *
 * Numeric values are converted to string by calling `value.toString()` before
 * testing it against the regex.
 *
 * If this method returns `true`, then you can safely parse the string with `parseFloat`
 * method.
 */
export function isDecimal(value: string | number, options?: { decimalPlaces?: string }): boolean {
    if (typeof value === 'number') {
        value = value.toString()
    }

    const decimalPlaces = (options && options.decimalPlaces) || '1,'
    return new RegExp(`^[-+]?([0-9]+)?(\\.[0-9]{${decimalPlaces}})$`).test(value)
}