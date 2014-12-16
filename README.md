TupperwareJS
============

![Build Status](https://travis-ci.org/HelpfulHuman/TupperwareJS.svg)

TupperwareJS is a dependency injection system for NodeJS that can be used in either functional or object-oriented contexts.

## Getting Started

Install via `npm` using the following command in Terminal:

```shell
npm install --save tupperware
```

## Object Usage

```javascript
var tupperware = require('tupperware')
var container  = tupperware.create()
```

### set( name [, options], value )

Adds a new value to your container's registry.

```javascript
container.set('foo', function () {
  return 'foo'
})

container.set('bar', function (foo) {
  // The `foo` function will be called and injected into
  // the `bar` function
  return foo + 'bar'
})
```

##### Storing Functions as Values

By default, TupperwareJS stores functions as resolvable factories.  If you want to store a function that will simply be returned (without be called), you can use the `isValue` option to store it as a value.

```javascript
container.set('foo', { isValue: true }, function () {
  return 'foo'
})
```

##### Explicitly Define Argument Names

If you're planning on doing anything that obscures the argument names for a function (namely, minification), then you'll want to provide the names manually.  You can do this using the `inject` option which should be an array of argument names.

```javascript
container.set('foo', { inject: ['foo', 'bar'] }, function (a, b) {
  return a + b
})
```

### get( name [, options] )

Resolves a set function's dependencies (and their dependencies) and then returns the value.  It should be noted that stored functions (that are not values) will cache their result and that result will be used for all subsequent requests.

```javascript
container.get('bar')
// => `foobar`
```

##### Factories

One added bonus of TupperwareJS is that any stored value can be returned as a factory object.  Simply suffix the name of the argument with `Factory` and use the `make()` function when creating new instances of the value you are resolving.

```javascript
container.set('random', function () {
  return Math.random()
})

container.inject(function (randomFactory) {
  var result1 = randomFactory.make() // => 0.2343245345
  var result2 = randomFactory.make() // => 0.6756572454
  var result3 = randomFactory.make() // => 0.4521243624
})
```

##### Optional Arguments

Sometimes, you might want to make certain arguments optional.  Using the `optional` option allows you to specify an array of argument names that will insert `null` if a specified argument can't be resolved.

```javascript
var result = container.get('bar', { optional: ['foo'] }, function (foo) {
  if (!foo) {
    return 'no foo set yet'
  }
})
// => 'no foo set yet'
```

##### Overriding Resolved Values

Coming soon.

### inject( [options, ] fn )

Automatically determines the dependencies of the given function and resolves them without the need of registering the function with the container.

```javascript
container.inject(function (bar) {
  return bar + 'baz'
})
// => `foobarbaz`
```

### provide( name, [options] )

Packages a container value into a function that can be called / resolve without the `container` object.

```javascript
var bar = container.provide('bar')

bar()
// => `foobar`
```

## Functional Usage

Coming soon.

### register( registry, name, [options, ] value )

Identical to `set()` above, except that a registry object is needed as the
first argument.

```javascript
var register = tupperware.register
var registry = {}

register(registry, 'foo', function () {
  return 'foo'
})

registry.foo()
// => 'foo'
```

### resolve( registry, name [, options] )

Indentical to `get()` above, except that a registry object is needed as the first argument.

```javascript
var resolve  = tupperware.resolve
var registry = { foo: 'bar' }

var foo = resolve(registry, 'foo')
// => 'bar'
```

### inject( registry, fn [, options] )

Identical to `inject()` above, except that a registry object is needed as the first argument.

```javascript
var inject    = tupperware.inject
var registry  = { name: 'world' }

var result = inject(registry, function (name) {
  return 'hello' + name
})
// => 'hello world'
```

### provide( registry, name [, options] )

Identical to `provide()` above, except that a registry object is needed as the first argument.

```javascript
var provide  = tupperware.provide
var registry = { foo: 'bar' }

var result = provide(registry, 'foo')

result()
// => 'bar'
```

### annotate( fn )

Returns an array containing all of the argument names for the given function.

```javascript
var annotate = tupperware.annotate

var args = annotate(function (foo, bar) {})
// => ['foo', 'bar']
```
