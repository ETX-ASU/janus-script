import { EnvObj } from './obj';
import EventEmitter from 'eventemitter3';

export class Environment {
    private store: Map<string, EnvObj> = new Map();
    private alias: Map<string, string> = new Map();
    private outer: Environment | null = null;

    private events = new EventEmitter();

    constructor(outer?: Environment) {
        if (outer) {
            this.outer = outer;
        }
    }

    public get OnChange() {
        return {
            addListener: (listener) => this.events.on('change', listener),
            removeListener: (listener) => this.events.off('change', listener)
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
        const changedKeys = new Set();
        changedKeys.add(name);
        // also check bindings
        this.alias.forEach((boundTo, bound) => { if (boundTo === name) { changedKeys.add(bound); } });
        this.events.emit('change', { changed: Array.from(changedKeys) });
        return value;
    }

    public Bind(name: string, to: string) {
        this.alias.set(name, to);
        this.events.emit('change', { changed: [name] });
        return this.Get(to);
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
