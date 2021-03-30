import { EnvObj } from './obj';

export class Environment {
    private store: Map<string, EnvObj> = new Map();
    private alias: Map<string, string> = new Map();
    private outer: Environment | null = null;

    constructor(outer?: Environment) {
        if (outer) {
            this.outer = outer;
        }
    }

    public Get(name: string) {
        let obj = this.store.get(name);
        if (!obj && this.alias.has(name)) {
            obj = this.Get(this.alias.get(name));
        }
        if (!obj && this.outer) {
            obj = this.outer.Get(name);
        }

        return obj;
    }

    public Set(name: string, value) {
        this.store.set(name, value);
        return value;
    }

    public Bind(name: string, to: string) {
        this.alias.set(name, to);
    }

    public toObj() {
        const result = {};

        this.store.forEach((value, key) => {
            // TODO: cut out functions?
            result[key] = value.toJS();
        });

        // add in bindings
        this.alias.forEach((_, bound) => {
            result[bound] = this.Get(bound).toJS();
        });

        return result;
    }

    public remove(name: string[]) {
        name.forEach((key) => {
            this.store.delete(key);
        })
        return name;
    }

    public toJSON() {
        return JSON.stringify(this.toObj());
    }
}
