import { EnvObj, EnvObjType } from './obj';

export class NumberObj implements EnvObj {
    constructor(private value: number = 0) {}

    get Value() {
        return this.value;
    }
    set Value(val: number) {
        this.value = val;
    }

    Type(): EnvObjType {
        return EnvObjType.NUMBER;
    }

    Inspect(): string {
        return this.Value.toString();
    }

    toJSON(): string {
        return JSON.stringify(this.value);
    }

    toJS() {
        return this.value;
    }

    Equals(obj: EnvObj) {
        if (obj.Type() !== this.Type()) {
            return false;
        }
        return this.value === (obj as NumberObj).Value;
    }
}
