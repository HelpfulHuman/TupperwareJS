TupperwareJS
============

![Build Status](https://travis-ci.org/HelpfulHuman/TupperwareJS.svg)

TupperwareJS is an "Inversion of Control" system for NodeJS that allows you to bundle application functionality into _"providers"_.

## Getting Started

Install via `npm` using the following command in Terminal:

```shell
npm install tupperware
```

Then create an instance of Tupperware to use throughout your application:

```javascript
var tupperware = require('tupperware'),
    app        = new tupperware();
```

Tupperware accepts an `options` object in its constructor.  Options set on the Tupperware instance will be passed to providers when they are being attached.  On top of this, Tupperware also has configuration options of its own that effect its behavior.  These are stored in their own `tupperware` object within the `options` object.

## Providers

A provider is any object that provides Tupperware with instructions and methods for implementation.

Let's create a simple provider that will allow us to output "hello world" to console by calling `app.hello()`.  In order to do this, we can create an object literal consisting of a `name` and `attach` method.  The `name` variable is required if we want to be able to have futures providers depend on this one.  The `attach` method will be invoked when bind or "attach" the provider to our application.

```javascript
var helloProvider = {
  name: 'myApp.hello',
  attach: function (app, options) {
    // add hello method
    app.hello = function () {
      console.log('hello world');
    };
  }
};
```

In order to use our provider, we will need to attach it to our application using the `attach()` method.  The `attach()` method takes our provider as the first argument.  Additionally, we can also pass along an `options` object and a callback.

```javascript
app.attach(helloProvider);

app.hello(); // Outputs "hello world"
```



