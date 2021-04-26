import * as math from 'mathjs';
import seedrandom from 'seedrandom';
import { BoolObj } from '../env/BoolObj';
import { BuiltInFunction, BuiltInFunctionObj } from '../env/BuiltinFunction';
import { ErrorObj } from '../env/ErrorObj';
import { HashObj } from '../env/Hash';
import { NullObj } from '../env/NullObj';
import { NumberObj } from '../env/NumberObj';
import { EnvObj, EnvObjType } from '../env/obj';
import { StringObj } from '../env/StringObj';
import { UndefinedObj } from '../env/UndefinedObj';

export const UNDEFINED = new UndefinedObj();
export const NULL = new NullObj();
export const TRUE = new BoolObj(true);
export const FALSE = new BoolObj(false);
export const NAN = new NumberObj(Number.NaN);

const builtinRound: BuiltInFunction = (input: EnvObj) => {
    if (input?.Type() !== EnvObjType.NUMBER) {
        return new ErrorObj('invalid input type');
    }
    const num = input as NumberObj;
    return new NumberObj(Math.round(num.Value));
};

const builtinJSON: BuiltInFunction = (input: EnvObj) => {
    return new StringObj(input.toJSON());
};

const builtinTypeof: BuiltInFunction = (input: EnvObj) => {
    return new StringObj(input.Type().toString());
};

const isInt = (x) => Math.floor(x) === x;
const builtinRand: BuiltInFunction = (min: EnvObj, max: EnvObj) => {
    if (!min && !max) {
        return new NumberObj(Math.random());
    }
    if (min && min.Type() !== EnvObjType.NUMBER) {
        return new ErrorObj(
            `(min) expected NUMBER got ${min.Type().toString()}`
        );
    }
    if (max && max.Type() !== EnvObjType.NUMBER) {
        return new ErrorObj(
            `(max) expected NUMBER got ${max.Type().toString()}`
        );
    }
    let minValue = 0;
    let maxValue = 0;
    if (!max) {
        maxValue = (min as NumberObj).Value;
    } else {
        minValue = (min as NumberObj).Value;
        maxValue = (max as NumberObj).Value;
    }
    let result;
    if (isInt(minValue) && isInt(maxValue)) {
        result = Math.floor(Math.random() * (maxValue - minValue) + minValue);
    } else {
        result = Math.random() * (maxValue - minValue) + minValue;
    }

    return new NumberObj(result);
};

const builtinMax: BuiltInFunction = (
    input1: EnvObj,
    input2: EnvObj,
    ...rest
) => {
    if (
        input1?.Type() !== EnvObjType.NUMBER ||
        input2?.Type() !== EnvObjType.NUMBER
    ) {
        return new ErrorObj('invalid input type');
    }
    if (rest?.length) {
        if (!rest.every((arg) => arg.Type() === EnvObjType.NUMBER)) {
            return new ErrorObj('all arguments must be NUMBER');
        }
    }
    const num1 = input1 as NumberObj;
    const num2 = input2 as NumberObj;
    const additional = rest.map((arg) => (arg as NumberObj).Value);
    return new NumberObj(Math.max(num1.Value, num2.Value, ...additional));
};

const builtinMin: BuiltInFunction = (
    input1: EnvObj,
    input2: EnvObj,
    ...rest
) => {
    if (
        input1?.Type() !== EnvObjType.NUMBER ||
        input2?.Type() !== EnvObjType.NUMBER
    ) {
        return new ErrorObj('invalid input type');
    }
    if (rest?.length) {
        if (!rest.every((arg) => arg.Type() === EnvObjType.NUMBER)) {
            return new ErrorObj('all arguments must be NUMBER');
        }
    }
    const num1 = input1 as NumberObj;
    const num2 = input2 as NumberObj;
    const additional = rest.map((arg) => (arg as NumberObj).Value);
    return new NumberObj(Math.min(num1.Value, num2.Value, ...additional));
};

const builtinLog: BuiltInFunction = (input1: EnvObj) => {
    if (input1?.Type() !== EnvObjType.NUMBER) {
        return new ErrorObj('invalid input type');
    }
    const num1 = input1 as NumberObj;
    return new NumberObj(Math.log(num1.Value));
};

let rng = seedrandom(1234567);
const builtinFixedRandom: BuiltInFunction = () => {
    return new NumberObj(rng());
};
const builtinSeedFixedRandom: BuiltInFunction = (seed: EnvObj) => {
    if (
        seed?.Type() !== EnvObjType.NUMBER &&
        seed?.Type() !== EnvObjType.STRING
    ) {
        return new ErrorObj('invalid input type');
    }
    rng = seedrandom((seed as NumberObj | StringObj).Value);
    return NULL;
};

const builtinMathEval: BuiltInFunction = (
    expression: EnvObj,
    scope?: EnvObj
) => {
    if (expression?.Type() !== EnvObjType.STRING) {
        return new ErrorObj('invalid input type, expects string');
    }
    if (scope) {
        if (scope.Type() !== EnvObjType.HASH) {
            return new ErrorObj('expected scope to be HASH OBJ');
        }
    }
    let result = '';
    try {
        const scopeObj = scope ? (scope as HashObj).toJS() : {};
        result = math.evaluate((expression as StringObj).Value, scopeObj);
    } catch (err) {
        return new ErrorObj('error parsing expression');
    }
    return new StringObj(result);
};

const builtinToString: BuiltInFunction = (value: EnvObj) => {
    if (!value) {
        return new ErrorObj('invalid input type');
    }
    return new StringObj(value.Inspect());
};

const builtinToNumber: BuiltInFunction = (value: EnvObj) => {
    if (value?.Type() !== EnvObjType.STRING) {
        return new ErrorObj('invalid input type, expects STRING');
    }
    let result;
    try {
        result = parseFloat((value as StringObj).Value);
    } catch (err) {
        return new ErrorObj('failed to parse number');
    }
    if (isNaN(result)) {
        return NAN;
    }
    return new NumberObj(result);
};

export const builtins: Map<string, EnvObj> = new Map();
builtins.set('null', NULL);
builtins.set('undefined', UNDEFINED);
builtins.set('NaN', NAN);
builtins.set('round', new BuiltInFunctionObj(builtinRound));
builtins.set('random', new BuiltInFunctionObj(builtinRand));
builtins.set('fixedrandom', new BuiltInFunctionObj(builtinFixedRandom));
builtins.set(
    'seed_fixed_random',
    new BuiltInFunctionObj(builtinSeedFixedRandom)
);
builtins.set('json', new BuiltInFunctionObj(builtinJSON));
builtins.set('string', new BuiltInFunctionObj(builtinToString));
builtins.set('number', new BuiltInFunctionObj(builtinToNumber));
builtins.set('typeof', new BuiltInFunctionObj(builtinTypeof));
builtins.set('Math.E', new NumberObj(Math.E));
builtins.set('Math.PI', new NumberObj(Math.PI));
builtins.set('Math.LN10', new NumberObj(Math.LN10));
builtins.set('Math.LN2', new NumberObj(Math.LN2));
builtins.set('Math.LOG2E', new NumberObj(Math.LOG2E));
builtins.set('Math.LOG10E', new NumberObj(Math.LOG10E));
builtins.set('Math.SQRT2', new NumberObj(Math.SQRT2));
builtins.set('Math.SQRT1_2', new NumberObj(Math.SQRT1_2));
builtins.set('Math.log', new BuiltInFunctionObj(builtinLog));
builtins.set('Math.max', new BuiltInFunctionObj(builtinMax));
builtins.set('Math.min', new BuiltInFunctionObj(builtinMin));
builtins.set('Math.round', new BuiltInFunctionObj(builtinRound));
builtins.set('Math.evaluate', new BuiltInFunctionObj(builtinMathEval));
