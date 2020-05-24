const Injector = require('../index');
const Student = require('./Student');
const studentApp = require('./app');

const {Container, createWire} = Injector;

const container = new Container();
const wire = createWire(container);

const studentSymbol = Symbol("Student");

container.bind(studentSymbol).to(Student);

const app = studentApp(wire, studentSymbol);

app();