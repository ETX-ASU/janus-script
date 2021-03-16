import { EnvObj, EnvObjType } from './obj';

export class ErrorObj implements EnvObj {
    constructor(private message: string = '') {}

    get Message() {
        return this.message;
    }
    set Message(val: string) {
        this.message = val;
    }

    Type(): EnvObjType {
        return EnvObjType.ERROR;
    }

    Inspect(): string {
        return `ERROR: ${this.Message}`;
    }

    toJSON(): string {
        return this.Inspect(); // TODO
    }
    
    toJS() {
        return new Error(this.message);
    }

    Equals(obj: EnvObj) {
        return obj.Type() === this.Type();
    }
}
