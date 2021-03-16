import { EnvObj, EnvObjType } from './obj';

export class NullObj implements EnvObj {
    Type(): EnvObjType {
        return EnvObjType.NULL;
    }

    Inspect(): string {
        return 'null';
    }

    toJSON(): string {
        return 'null';
    }

    toJS() {
        return null;
    }

    Equals(obj: EnvObj) {
        return obj.Type() === this.Type();
    }
}
