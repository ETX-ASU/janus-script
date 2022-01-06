import { EnvObj } from './obj';
import EventEmitter from 'eventemitter3';
import { ErrorObj } from './ErrorObj';
import { NULL } from '../eval/builtin';

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

    public addListener(event: string, fn: any, context?: any, once?: boolean) {
        if (once) {
            this.events.once(event, fn, context);
            return;
        }
        this.events.addListener(event, fn, context);
    }

    public removeListener(
        event: string,
        fn: any,
        context?: any,
        once?: boolean
    ) {
        this.events.removeListener(event, fn, context, once);
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

    public Set(name: string, value: EnvObj) {
        const current = this.store.get(name);
        if (current && current.Equals(value)) {
            return current;
        }
        this.store.set(name, value);
        const changedKeys = new Set();
        changedKeys.add(name);
        const recursebindings = (n: string) => {
            const found = [];
            this.alias.forEach((boundTo, bound) => {
                if (boundTo === n) {
                    found.push(bound);
                    found.push(...recursebindings(bound));
                }
            });

            return found;
        };
        // also check bindings
        const bindingChanges = recursebindings(name);
        bindingChanges.forEach((key) => {
            changedKeys.add(key);
        });
        if (changedKeys.size > 0) {
            this.events.emit('change', { changed: Array.from(changedKeys) });
        }
        return value;
    }

    public isSet(name: string) {
        return this.store.has(name);
    }

    public Clear(name: string) {
        const changedKeys = new Set();
        let change = false;
        if (this.store.has(name)) {
            change = true;
            changedKeys.add(name);
            // also check bindings
            this.alias.forEach((boundTo, bound) => {
                if (boundTo === name) {
                    changedKeys.add(bound);
                }
            });
            this.store.delete(name);
        }
        if (this.alias.has(name)) {
            change = true;
            changedKeys.add(name);
            // also check bindings
            this.alias.forEach((boundTo, bound) => {
                if (boundTo === name) {
                    changedKeys.add(bound);
                }
            });
            this.alias.delete(name);
        }
        if (change) {
            this.events.emit('change', { changed: Array.from(changedKeys) });
        }
        return NULL;
    }

    public Bind(name: string, to: string) {
        if (this.alias.has(to)) {
            // make sure there are no loops
            const boundTo = this.alias.get(to);
            if (boundTo === name) {
                return new ErrorObj(`Cannot bind: ${to} is already bound to ${name}, no looping allowed.`);
            }
        }
        this.alias.set(name, to);
        /* this.events.emit('change', { changed: [name] }); */
        return this.Get(to);
    }

    public Unbind(name: string) {
        if (!this.isBound(name)) {
            return new ErrorObj(`Identifier ${name} has not been bound.`);
        }
        this.alias.delete(name);
        return NULL;
    }

    public isBound(name: string) {
        return this.alias.has(name);
    }

    public toObj() {
        const result = {};

        this.store.forEach((value, key) => {
            // TODO: cut out functions?
            result[key] = value.toJS();
        });

        // add in bindings
        this.alias.forEach((_, bound) => {
            const boundValue = this.Get(bound);
            if (boundValue) {
                result[bound] = this.Get(bound).toJS();
            }
        });

        return result;
    }

    public remove(name: string[]) {
        name.forEach((key) => {
            this.store.delete(key);
        });
        return name;
    }

    public toJSON() {
        return JSON.stringify(this.toObj());
    }

    public hasOuter() {
        return this.outer !== null;
    }
}
