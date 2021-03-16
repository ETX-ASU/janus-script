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
}

const builtinTypeof: BuiltInFunction = (input: EnvObj) => {
    return new StringObj(input.Type().toString());
}

export const builtins: Record<string, EnvObj> = {
    null: NULL,
    undefined: UNDEFINED,
    round: new BuiltInFunctionObj(builtinRound),
    json: new BuiltInFunctionObj(builtinJSON),
    typeof: new BuiltInFunctionObj(builtinTypeof),
    'Math.PI': new NumberObj(Math.PI),
};
