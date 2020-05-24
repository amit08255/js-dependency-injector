/**
 * @property {object} _target
 * @property {constructor} _target.object - Optional property
 * @property {function} _target.factory - Optional property
 * @property {any} _target.value - Optional property
 * @property {any} _target.cache - Optional property
 * @property {boolean} _target.singleton - Optional property
 */
class Options {
    constructor(_target) {}

    inSingletonScope() {
        this._target.singleton = true;
    }
}

/**
 * @property {object} _target
 * @property {constructor} _target.object - Optional property
 * @property {function} _target.factory - Optional property
 * @property {any} _target.value - Optional property
 * @property {any} _target.cache - Optional property
 * @property {boolean} _target.singleton - Optional property
 */
class Bind {
    constructor(target) {
        this._target = target;
    }

    /**
     * 
     * @param {constructor} object - Object constructor to bind
     */
    to(object) {
        this._target.object = object;
        return new Options(this._target);
    }

    /**
     * 
     * @param {function} factory - Function to bind as factory
     */
    toFactory(factory) {
        this._target.factory = factory;
        return new Options(this._target);
    }

    /**
     * 
     * @param {any} value - Value to bind
     */
    toValue(value) {
        if (typeof value === "undefined") {
            throw "cannot bind a value of type undefined";
        }
        this._target.value = value;
    }
}

class Container {
    _registry = new Map();
    _snapshots = [];

    /**
     * 
     * @param {Symbol} type - Symbol type object.
     */
    bind(type) {
        return new Bind(this._add(type));
    }

    /**
     * 
     * @param {Symbol} type - Symbol type object.
     */
    rebind(type) {
        return this.remove(type).bind<T>(type);
    }

    /**
     * 
     * @param {Symbol} type - Symbol type object.
     * @returns {Container}
     */
    remove(type) {
        if (this._registry.get(type) === undefined) {
            throw `${type.toString()} was never bound`;
        }

        this._registry.delete(type);

        return this;
    }

    /**
     * 
     * @param {Symbol} type - Symbol type object.
     * @returns {any}
     */
    get(type) {
        const regItem = this._registry.get(type);

        if (regItem === undefined) {
            throw `nothing bound to ${type.toString()}`;
        }

        const {object, factory, value, cache, singleton} = regItem;

        /**
         * 
         * @param {function} creator
         */
        const cacheItem = (creator) => {
            if (singleton && typeof cache !== "undefined") return cache;
            if (!singleton) return creator();
            regItem.cache = creator();
            return regItem.cache;
        };

        if (typeof value !== "undefined") return value;
        if (typeof object !== "undefined") return cacheItem(() => new object());
        if (typeof factory !== "undefined") return cacheItem(() => factory());

        throw `nothing is bound to ${type.toString()}`;
    }

    /**
     * @returns {Container}
     */
    snapshot() {
        this._snapshots.push(new Map(this._registry));
        return this;
    }

    /**
     * @returns {Container}
     */
    restore() {
        this._registry = this._snapshots.pop() || this._registry;
        return this;
    }

    /**
     * 
     * @param {Symbol} type - Symbol type object.
     * @returns {object} - Returns _object type
     */
    _add(type) {
        if (this._registry.get(type) !== undefined) {
            throw `object can only bound once: ${type.toString()}`;
        }

        const conf = {singleton: false};
        this._registry.set(type, conf);

        return conf;
    }
}

module.exports = Container;