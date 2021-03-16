import { EnvObj, EnvObjType } from './obj';

export class ArrayObj implements EnvObj {
    constructor(private elements: EnvObj[] = []) {}

    get Elements() {
        return this.elements;
    }
    set Elements(val) {
        this.elements = val;
    }

    Type(): EnvObjType {
        return EnvObjType.ARRAY;
    }

    Inspect(): string {
        const elements = this.elements.map((p) => p.Inspect()).join(', ');
        return `[${elements}]`;
    }

    toJSON(): string {
        return JSON.stringify(this.toJS());
    }

    toJS() {
        const arr = this.elements.map((e) => e.toJS());
        return arr;
    }

    Equals(obj: EnvObj) {
        return obj === this;
    }
}
