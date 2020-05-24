const inject = require('./inject');
const Container = require('./container');

module.exports = {
    Container: Container,
    createDecorator: inject.createDecorator,
    createWire: inject.createWire,
    createResolve: inject.createResolve,
    NOCACHE: inject.NOCACHE
}

