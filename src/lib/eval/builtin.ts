import { BoolObj } from '../env/BoolObj';
import { BuiltInFunction, BuiltInFunctionObj } from '../env/BuiltinFunction';
import { ErrorObj } from '../env/ErrorObj';
import { NullObj } from '../env/NullObj';
import { NumberObj } from '../env/NumberObj';
import { EnvObj, EnvObjType } from '../env/obj';
import { StringObj } from '../env/StringObj';
import { UndefinedObj } from '../env/UndefinedObj';

export const UNDEFINED = new UndefinedObj();
export const NULL = new NullObj();
export const TRUE = new BoolObj(true);
export const FALSE = new BoolObj(false);

const builtinRound: BuiltInFunction = (input: EnvObj) => {
    if (input.Type() !== EnvObjType.NUMBER) {
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

export const builtins: Record<string, EnvObj> = {
    null: NULL,
    undefined: UNDEFINED,
    round: new BuiltInFunctionObj(builtinRound),
    rand: new BuiltInFunctionObj(builtinRand),
    json: new BuiltInFunctionObj(builtinJSON),
    typeof: new BuiltInFunctionObj(builtinTypeof),
    'Math.PI': new NumberObj(Math.PI),
};
