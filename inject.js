const Container = require("./container");

const NOCACHE = Symbol("NOCACHE");

/**
 * 
 * @param {object} target 
 * @param {string} property 
 * @param {Container} container 
 * @param {Symbol} type 
 * @param {Array<Symbol>} args 
 */
function define(target, property, container, type, args) {
    Object.defineProperty(target, property, {
        get: function() {
            const value = container.get(type);
            if (args.indexOf(NOCACHE) === -1) {
                Object.defineProperty(this, property, {
                    value,
                    enumerable: true,
                });
            }
            return value;
        },
        configurable: true,
        enumerable: true,
    });
}

/**
 * 
 * @param {Symbol} type 
 * @param {Container} container 
 * @param {Array<Symbol>} args 
 * @returns {(target:object, property:string)}
 */
function inject(type, container, args) {
    
    return (target, property) => {
        define(target, property, container, type, args);
    };
}

/**
 * Wire up dependent to the dependency. 
 * Before wiring up dependency binded in the container you must create wire with this function.
 * Then you can use returned wire object to wire up dependency from container in your module.
 * 
 * @param {Container} container 
 * @returns {(target:any, property:any|string, type:Symbol, ...args:Array<Symbol>)}
 */
function createWire(container) {
    return (target, property, type, ...args) => {
        define(target, property, container, type, args);
    };
}

/**
 * 
 * @param {Container} container 
 * @returns {(type:Symbol, ...args:Array<Symbol>)}
 */
function createResolve(container) {
    return (type, ...args) => {
        let value;
        return () => {
            if (args.indexOf(NOCACHE) !== -1 || value === undefined) {
                value = container.get(type);
            }
            return value;
        };
    };
}

module.exports = {
    NOCACHE: NOCACHE,
    createDecorator: createDecorator,
    createWire: createWire,
    createResolve: createResolve
}
