import { EnvObj, EnvObjType } from './obj';

export class UndefinedObj implements EnvObj {
    Type(): EnvObjType {
        return EnvObjType.UNDEFINED;
    }

    Inspect(): string {
        return 'undefined';
    }

    toJSON(): string {
        return 'undefined';
    }

    toJS() {
        return undefined;
    }

    Equals(obj: EnvObj) {
        return obj.Type() === this.Type();
    }
}
