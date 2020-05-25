<p align="center"><h1 align="center">JavaScript Dependency Injector</h1></p>

## Features

* Zero dependency
* Similar syntax to InversifyJS
* Can be used without decorators
* Less Features but **straight forward**
* Can bind dependencies as **classes**, **factories** and **static values**
* Supports binding in **singleton scope**
* **Cached** - Resolves only once in each dependent class by default
* Made with **unit testing** in mind
* Supports dependency **rebinding** and container **snapshots** and **restores**
* **Lightweight** - Just around **750 Byte gzip** and **650 Byte brotli** compressed
* Does **NOT** need reflect-metadata which size is around 50 kb

## The Container API

### Creating a container

The container is the place where all dependencies get bound to. It is possible to have multiple container in our project in parallel. Best practice is to create a main AppContainer and inside that container create child containers of dependencies to categorize them easily. Then to inject dependencies you just have to share the main AppContainer to app modules.

```js
import {Container} from "./container";
const container = new Container();
```

### Binding

#### Binding a class

This is the default way to bind a dependency. The class will get instantiated when the
dependency gets resolved.

```js
const studentSymbol = Symbol("student");
container.bind(studentSymbol).to(StudentClass);
```

#### Binding a class in singleton scope

This will create only one instance of `StudentClass`

```js
container.bind(studentSymbol).to(StudentClass).inSingletonScope();
```

#### Binding a factory

Factories are functions which will get called when the dependency gets resolved 

```js
container.bind(studentSymbol2).toFactory(() => new StudentClass());
container.bind(studentSymbol3).toFactory(() => "just a string");
```

A factory can configured for singleton scope too. This way will only executed once.

```js
container.bind(studentSymbol).toFactory(() => new StudentClass()).inSingletonScope();
```

#### Binding a value

This is always like singleton scope, but it should be avoid to instantiate
dependencies here. If they are circular dependencies, they will fail. 

```js
container.bind(studentSymbol5).toValue(new StudentClass()); // Bad, should be avoid
container.bind(studentSymbol6).toValue("just a string");
container.bind(studentSymbol7).toValue(() => "i am a function");
```

### Rebinding

This is the way how we can rebind a dependency while **unit tests**. We should not need to
rebind in production code.

```js
container.rebind(studentSymbol8).toValue(new StudentMock());
```

### Removing

Normally this function is not used in production code. This will remove the
dependency from the container. 

```js
container.remove(studentSymbol);
```

### Getting a dependency

Getting dependencies through `container.get()` is only meant for **unit tests**. 
This is also the internal way how the functions `wire()` and `resolve()` are getting the
dependency.
 
```js
container.get(studentSymbol);
```

To get a dependency in production code use `wire()` or `resolve()`. Using `container.get()`
directly to getting dependencies can result in infinite loops with circular dependencies when called inside of
constructors. In addition `container.get()` does not respect the cache. 

> **Important Note:**  You should avoid accessing the dependencies from any constructor. With circular dependencies
> this can result in a infinite loop.

### Snapshot & Restore

This creates a snapshot of the bound dependencies. After this we can rebind dependencies
and can restore it back to its old state after we made some **unit tests**.

```js
container.snapshot();
```
```js
container.restore();
```

## The `wire()` Function

If we do not want to use decorators, we can use the wire function. It does the same like the `inject`
decorator and we have to create the function first like we do with `inject`.

```js
import {createWire} from "./inject";
export const wire = createWire(container);
```

Then we can wire up the dependent to the dependency.

```js
class Example {

    constructor() {
        wire(this, "student", studentSymbol);
    }
    
    method() {
        this.student.doSomething();
    }
}
```

> Notice: With `wire()` the property, in this case `student`, has to be public. 

## The `resolve()` Function

A second way to resolve a dependency without decorators is to use `resolve()`.
To use `resolve()` we have to create the function first.

```js
import {createResolve} from "./inject";
export const resolve = createResolve(container);
```

Then we can resolve the dependency in classes and even functions.

```js
class Example {
    student = resolve(studentSymbol);
    
    method() {
        this.student().doSomething();
    }
}
```

```js
function Example() {
    const student = resolve(studentSymbol);
    student().doSomething();
}
```

> Notice: We access the dependency through a function.
> The dependency is not assigned directly to the property/constant.
> If we want direct access we can use `container.get()` but we should avoid
> using `get()` inside of classes because we then loose the lazy dependency
> resolving/injection behavior and caching.

## The `symbol`

Symbols are used to identify our dependencies. A good practice is to keep them in one place.

```js
export const TYPE = {
    "studentSymbol": Symbol("student"),
    // [...]
}
```

Symbols can be defined with `Symbol.for()` too. This way they are not unique.
Remember `Symbol('foo') === Symbol('foo')` is `false` but
`Symbol.for('foo') === Symbol.for('foo')` is `true`

```js
export const TYPE = {
    "Service": Symbol.for("Service"),
    // [...]
}
```

> Since 1.0.0-beta.3 we use the symbol itself for indexing the dependencies.
> Prior to this version we indexed the dependencies by the string of the symbol.

## Usage

#### Step 1 - Import Container and required functions from index.js and inject.js

#### Step 2 - Creating symbols for our dependencies

#### Step 3 - Example services

Next we create out example services.

#### Step 4 - Creating a container

#### Step 5 - Injecting dependencies

If we run this example we should see the content of our example services.

The dependencies (services) will injected on the first call. This means if you rebind the service after
accessing the properties of the Example class, it will not resolve a new service. If you want a new 
service each time you call `example.myService` you have to add the `NOCACHE` tag:

In this case the last two `console.log()` outputs should show different numbers.

## Unit testing

For unit testing we first create our mocks

Within the tests we can snapshot and restore a container.
We are able to make multiple snapshots in a row too.

## Inspiration

This library is highly inspired by [InversifyJS](https://github.com/inversify/InversifyJS)
but has other goals:

1. Make the library very lightweight (less than one kilobyte)
2. Implementing less features to make the API more straight forward
3. Always lazy inject the dependencies
4. No meta-reflect required

## License

**MIT**
