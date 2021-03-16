import { NullObj } from './NullObj';
import { EnvObj, EnvObjType } from './obj';

export type BuiltInFunction = (...args: EnvObj[]) => EnvObj;

export class BuiltInFunctionObj implements EnvObj {
    constructor(private fn: BuiltInFunction = () => new NullObj()) {}

    get Fn() {
        return this.fn;
    }
    set Fn(val) {
        this.fn = val;
    }

    Type(): EnvObjType {
        return EnvObjType.BUILTIN;
    }

    Inspect(): string {
        return 'builtin function';
    }

    toJSON(): string {
        return 'TODO';
    }

    toJS() {
        return () => {}; // not sure
    }

    Equals(obj: EnvObj) {
        return obj === this;
    }
}
