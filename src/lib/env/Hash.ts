import { BoolObj } from './BoolObj';
import { NumberObj } from './NumberObj';
import { StringObj } from './StringObj';
import { EnvObj, EnvObjType } from './obj';

const hashCode = (str: string) => {
    let hash = 0;
    let chr;
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // convert to 32 bit int
    }
    return hash;
};

export const hashKey = (from: EnvObj) => {
    switch (from.Type()) {
        case EnvObjType.BOOLEAN:
            return (from as BoolObj).Value ? 1 : 0;
        case EnvObjType.NUMBER:
            return (from as NumberObj).Value;
        case EnvObjType.STRING:
            return hashCode((from as StringObj).Value);
        default:
            throw new Error(`Invalid HashKey from ${from.Type()}!`);
    }
};

/* export class HashKey {
    private type: EnvObjType;
    private value: number;

    get Type() {
        return this.type;
    }
    get Value() {
        return this.value;
    }

    constructor(from: EnvObj) {
        switch (from.Type()) {
            case EnvObjType.BOOLEAN:
                this.type = from.Type();
                this.value = (from as BoolObj).Value ? 1 : 0;
                break;
            case EnvObjType.NUMBER:
                this.type = from.Type();
                this.value = (from as NumberObj).Value;
                break;
            case EnvObjType.STRING:
                this.type = from.Type();
                this.value = hashCode((from as StringObj).Value);
                break;
            default:
                throw new Error(`Invalid HashKey from ${from.Type()}!`);
        }
    }
} */

export const Hashable = (obj: EnvObj) =>
    obj.Type() === EnvObjType.BOOLEAN ||
    obj.Type() === EnvObjType.NUMBER ||
    obj.Type() === EnvObjType.STRING;

export type HashPair = {
    Key: EnvObj;
    Value: EnvObj;
};

export class HashObj implements EnvObj {
    constructor(private pairs: Map<number, HashPair> = new Map()) {}

    get Pairs() {
        return this.pairs;
    }

    Type(): EnvObjType {
        return EnvObjType.HASH;
    }

    Inspect(): string {
        const pairs: string[] = [];
        this.pairs.forEach((value) => {
            pairs.push(`${value.Key.Inspect()}:${value.Value.Inspect()}`);
        });
        return `{${pairs.join(', ')}}`;
    }

    toJSON(): string {
        return JSON.stringify(this.toJS());
    }

    toJS() {
        const obj = {};
        this.pairs.forEach((value) => {
            obj[value.Key.Inspect()] = value.Value.toJS();
        });
        return obj;
    }

    Equals(obj: EnvObj) {
        return obj === this;
    }
}
