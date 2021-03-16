import { EnvObj, EnvObjType } from './obj';

export class StringObj implements EnvObj {
    constructor(private value: string = '') {}

    get Value() {
        return this.value;
    }
    set Value(val: string) {
        this.value = val;
    }

    Type(): EnvObjType {
        return EnvObjType.STRING;
    }

    Inspect(): string {
        return this.Value;
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
        return this.value === (obj as StringObj).Value;
    }
}
