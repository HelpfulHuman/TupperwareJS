var util    = require('underscore');

function Tupperware (options)
{

  // Define our default options
  var defaults = {
    tupperware: {
      init: true,
      attach: true,
      overwrites: false
    }
  };

  // Configure our application instance
  this.options = util.extend(defaults, options)

  // Prepare other needed variables
  this.providers = {};

};

/**
 * The `attach()` method takes attaches the given `provider` to the
 * `Tupperware` instance.  An optional `options` object and `callback`
 * can be provided as well.
 */
Tupperware.prototype.attach = function (provider, options, callback)
{

  // If provider is a function, pass it our `Tupperware` instance
  // and capture the results (which should be an object)
  if (typeof provider === 'function') {
    provider = provider(this);
  }

  // Ensure that a valid provider was given
  if (typeof provider !== 'object') {
    console.log('Invalid provider: Instance of provider is not an object!');
    return callback && callback(new Error('Invalid Provider'));
  }

  // Providers must have a `name` string in order to be valid
  if (typeof provider.name !== 'string') {
    console.log('Invalid provider: A valid name (string) must be supplied!');
    return callback && callback(new Error('Invalid Provider'));
  }

  var name = provider.name;

  // Extend the options on our `Tupperware` instance with any options
  // supplied.
  options = util.extend(this.options, (options || {}));
  tupops  = options.tupperware;

  // Check if we have an existing provider with the same name attached.
  if (this.contains(name)) {
    // If we do but `options.overwrites` is `false`, exit out
    if (tupops.overwrites !== true) {
      return callback && callback();
    }

    // Go ahead and detach the existing provider
    this.detach(name);
  }

  // TODO: Check for dependencies

  // Store our provider under its set `name` in our `providers` object
  this.providers[name] = provider;

  // If we have an `attach` method, we need to call it and pass
  // our `Tupperware` instance and `options` object
  if (this.providers[name].attach && tupops.attach !== false) {
    this.providers[name].attach(this, options);
  }

  // Exit out if initializers are disabled
  if (tupops.init === false) {
    return callback && callback();
  }

  // if (!this.initialized) {
  //   this.initializers[name] = plugin.init || true;
  //   this.initlist.push(name);
  //   return callback && callback();
  // }
  // else if (plugin.init) {
  //   plugin.init.call(this, function (err) {
  //     var args = err
  //       ? [['plugin', name, 'error'], err]
  //       : [['plugin', name, 'init']];

  //     self.emit.apply(self, args);
  //     return callback && (err ? callback(err) : callback());
  //   });
  // }
};

/**
 * The `detach()` method will remove a `provider` from the `providers`
 * list and call the provider's `detach()` method if available.
 */
Tupperware.prototype.detach = function (name, callback)
{
  // If we have a provider with the given name and that provider has a
  // `detach()` method, call the `detach()` method
  if (typeof this.providers[name].detach === 'function') {
    this.providers[name].detach(this);
    delete this.providers[name];
  }

  // TODO: Call detach on any providers that rely on this provider

  return callback && callback();
};

/**
 * The `contains()` method returns true if the `Tupperware` instance has
 * a provider with the given `name`.
 */
Tupperware.prototype.contains = function (name)
{
  return !!this.providers[name];
};

// Export our tupperware "class"
module.exports = Tupperware;