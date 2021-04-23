import seedrandom from 'seedrandom';
import { BoolObj } from '../env/BoolObj';
import { BuiltInFunction, BuiltInFunctionObj } from '../env/BuiltinFunction';
import { ErrorObj } from '../env/ErrorObj';
import { NullObj } from '../env/NullObj';
import { NumberObj } from '../env/NumberObj';
import { EnvObj, EnvObjType } from '../env/obj';
import { StringObj } from '../env/StringObj';
import { UndefinedObj } from '../env/UndefinedObj';
import * as math from 'mathjs';

export const UNDEFINED = new UndefinedObj();
export const NULL = new NullObj();
export const TRUE = new BoolObj(true);
export const FALSE = new BoolObj(false);

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

const builtinMax: BuiltInFunction = (input1: EnvObj, input2: EnvObj) => {
    if (
        input1?.Type() !== EnvObjType.NUMBER ||
        input2?.Type() !== EnvObjType.NUMBER
    ) {
        return new ErrorObj('invalid input type');
    }
    const num1 = input1 as NumberObj;
    const num2 = input2 as NumberObj;
    return new NumberObj(Math.max(num1.Value, num2.Value));
};

const builtinMin: BuiltInFunction = (input1: EnvObj, input2: EnvObj) => {
    if (
        input1?.Type() !== EnvObjType.NUMBER ||
        input2?.Type() !== EnvObjType.NUMBER
    ) {
        return new ErrorObj('invalid input type');
    }
    const num1 = input1 as NumberObj;
    const num2 = input2 as NumberObj;
    return new NumberObj(Math.min(num1.Value, num2.Value));
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

const builtinMathEval: BuiltInFunction = (expression: EnvObj) => {
    if (expression?.Type() !== EnvObjType.STRING) {
        return new ErrorObj('invalid input type, expects string');
    }
    let result = '';
    try {
        result = math.evaluate((expression as StringObj).Value);
    } catch (err) {
        return new ErrorObj('error parsing expression');
    }
    return new StringObj(result);
};

export const builtins: Record<string, EnvObj> = {
    null: NULL,
    undefined: UNDEFINED,
    round: new BuiltInFunctionObj(builtinRound),
    rand: new BuiltInFunctionObj(builtinRand),
    fixedrandom: new BuiltInFunctionObj(builtinFixedRandom),
    seed_fixed_random: new BuiltInFunctionObj(builtinSeedFixedRandom),
    json: new BuiltInFunctionObj(builtinJSON),
    typeof: new BuiltInFunctionObj(builtinTypeof),
    'Math.E': new NumberObj(Math.E),
    'Math.PI': new NumberObj(Math.PI),
    'Math.LN10': new NumberObj(Math.LN10),
    'Math.LN2': new NumberObj(Math.LN2),
    'Math.LOG2E': new NumberObj(Math.LOG2E),
    'Math.LOG10E': new NumberObj(Math.LOG10E),
    'Math.SQRT2': new NumberObj(Math.SQRT2),
    'Math.SQRT1_2': new NumberObj(Math.SQRT1_2),
    'Math.log': new BuiltInFunctionObj(builtinLog),
    'Math.max': new BuiltInFunctionObj(builtinMax),
    'Math.min': new BuiltInFunctionObj(builtinMin),
    'Math.round': new BuiltInFunctionObj(builtinRound),
    'Math.evaluate': new BuiltInFunctionObj(builtinMathEval),
};
