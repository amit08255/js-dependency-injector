const inject = require('./inject');
const Container = require('./container');

module.exports = {
    Container: Container,
    createWire: inject.createWire,
    createResolve: inject.createResolve,
    NOCACHE: inject.NOCACHE
}

