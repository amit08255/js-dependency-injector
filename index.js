const inject = require('./inject');
const ContainerClass = require('./container');

module.exports = {
    Container: ContainerClass.Container,
    createDecorator: inject.createDecorator,
    createWire: inject.createWire,
    createResolve: inject.createResolve,
    NOCACHE: inject.NOCACHE
}

