/**
* Returns an array of the argument names for the given
* function.
*
* #### Exmaples:
*
* ```javascript
* annotate(function (arg1, arg2) {});
* // => ['arg1', 'arg2']
* ```
*
* @param  {Function} fn The function to annotate
* @return {Array}
*/
var annotate = exports.annotate = function (fn) {
  if (typeof fn !== 'function') {
    throw new Error('Bad argument: fn')
  }

  var consumes = fn
    .toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
    .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
    .split(/,/)

  if (consumes.length === 1 && !consumes[0]) {
    consumes = []
  }

  return consumes
}

/**
 * Checks for the existence of the requested container, resolves
 * any dependencies, manages circular dependencies and returns
 * the result.
 *
 * @param {Object} registry
 * @param {String} name
 * @param {Object} options
 * @return {mixed}
 */
var resolve = exports.resolve = function (registry, name, options) {
  return _resolve(registry, name, options, [])
}

var _resolve = function (registry, name, options, resolved) {
  if (typeof registry !== 'object') {
    throw new Error('Bad argument: registry')
  }

  if (typeof name !== 'string') {
    throw new Error('Bad argument: name')
  }

  options = options || {}
  var isFactory = (name.indexOf('Factory') !== -1)

  if (isFactory) {
    name = name.replace('Factory', '')
  }

  if (typeof registry[name] === 'undefined') {
    var optionals = options.optional || []
    if (optionals.indexOf(name) !== -1) {
      return null
    }
    else {
      throw new Error('Can\'t resolve dependency: ' + name)
    }
  }

  if (resolved.indexOf(name) !== -1) {
    throw new Error('Circular dependency error: ' + name)
  }

  var container = registry[name]

  resSliced = resolved.slice(0)
  resSliced.push(name)

  if (typeof container !== 'function' || container._tupperware !== true) {
    if (isFactory) {
      return {
        make: function () {
          return container
        }
      }
    }
    else {
      return container
    }
  }

  if (isFactory) {
    return {
      make: function (opts) {
        return _inject(registry, opts, container, resSliced)
      }
    }
  }

  if (typeof container._tupcache === 'undefined') {
    container._tupcache = _inject(registry, options, container, resSliced)
  }

  return container._tupcache
}

/**
* Resolves the given function's dependencies and calls the
* function with them.
*
* @param {Object} registry
* @param {Object} options
* @param {Function} fn
* @return {mixed}
*/
var inject = exports.inject = function (registry, options, fn) {
  return _inject(registry, options, fn, [])
}

var _inject = function (registry, options, fn, resolved) {
  if (typeof registry !== 'object') {
    throw new Error('Bad argument: registry')
  }

  if (!fn) {
    fn = options
    options = {}
  }

  options = options || {}

  if (typeof fn !== 'function') {
    throw new Error('Bad argument: fn')
  }

  var consumes = options.inject || annotate(fn)
  var deps = []

  for (var i = 0; i < consumes.length; i++) {
    var dep = _resolve(registry, consumes[i], options, resolved)
    deps.push(dep)
  }

  return fn.apply({}, deps)
}

/**
 * Adds the keypair to the registry and determines whether or not
 * a given function should be added as a factory.
 *
 * @param {Object} registry
 * @param {String} name
 * @param {Object} opts
 * @param {mixed} val
 */
var register = exports.register = function (registry, name, options, val) {
  if (typeof registry !== 'object') {
    throw new Error('Bad argument: registry')
  }

  if (typeof name !== 'string') {
    throw Error('Bad argument: name')
  }

  if (!val) {
    val = options
    options = {}
  }

  if (typeof val === 'function' && !options.isValue) {
    val._tupperware = true
  }

  registry[name] = val
}

/**
 * Exports anything in the registry as a factory that can be called
 * from anywhere in an application.
 *
 * @param {Object} registry
 * @param {String} name
 * @return {Function}
 */
var provide = exports.provide = function (registry, name) {
  if (typeof registry !== 'object') {
    throw new Error('Bad argument: registry')
  }

  if (typeof name !== 'string') {
    throw new Error('Bad argument: name')
  }

  if (!registry[name]) {
    throw new Error('Couldn\'t provide: ' + name)
  }

  var val = registry[name]

  if (!val._tupperware) {
    return function () {
      return val
    }
  }
  else {
    return function (opts) {
      return _inject(registry, val, opts, [])
    }
  }
}

/**
 * Creates an returns a new tupperware container object that
 * can be used instead of a functional approach.
 *
 * @param {Object} options
 * @return {Object}
 */
exports.create = function (options) {
  options = options || {}
  var registry = {}

  return {
    set: function (name, opts, val) {
      register(registry, name, opts, val)
    },
    get: function (name, opts) {
      return _resolve(registry, name, opts, [])
    },
    inject: function (opts, fn) {
      return _inject(registry, opts, fn, [])
    },
    provide: function (name) {
      return provide(registry, name)
    }
  }
}
