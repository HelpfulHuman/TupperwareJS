var expect      = require('chai').expect,
    tupperware  = require('../lib/tupperware');

describe('A tupperware app instance', function ()
{

  var app = new tupperware();

  // Module
  it('should have the correct properties and methods', function ()
  {
    expect(app).to.be.an.instanceof(tupperware);
    expect(app).to.have.property('options').that.is.an('object');
    expect(app).to.have.property('providers').that.is.an('object');
    expect(app).to.have.property('attach').that.is.an('function');
    expect(app).to.have.property('detach').that.is.an('function');
    expect(app).to.have.property('contains').that.is.an('function');
  });

  // contains()
  it('should be able to verify attached providers', function ()
  {
    var name = 'tests.exists';
    app.providers[name] = {};
    expect(app.contains(name)).to.be.true();
  });

  // attach()
  it('should be able to attach providers', function ()
  {
    var provider = {
      name: 'tests.attach',
      attach: function (app, options)
      {
        app.attached = true;
      }
    };

    app.attach(provider);
    expect(app.providers[provider.name]).to.be.an('object');
    expect(app.attached).to.be.true();
  });

  // detach()
  it('should be able to detach providers', function ()
  {
    var provider = {
      name: 'tests.detach',
      attach: function (app, options)
      {
        app.detached = false;
      },
      detach: function (app)
      {
        app.detached = true;
      }
    };

    app.attach(provider);
    expect(app.detached).to.be.false();
    expect(app.contains(provider.name)).to.be.true();

    app.detach(provider.name);
    expect(app.detached).to.be.true();
    expect(app.contains(provider.name)).to.be.false();

  });

});