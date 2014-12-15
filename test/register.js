var expect    = require('chai').expect
var register  = require('../lib/tupperware').register

describe('tupperware#register', function () {

  it('throws an error for a bad registry argument', function () {
    var testCall = function () { register('foo', 'bar', 'baz'); }

    expect( testCall ).to.throw('Bad argument: registry')
  })

  it('throws an error for a bad name argument', function () {
    var testCall = function () { register({}, false); }

    expect( testCall ).to.throw('Bad argument: name')
  })

  it('stores basic values', function () {
    var registry = {}
    register(registry, 'foo', 'bar')

    expect( registry.foo ).to.equal('bar')
  })

  it('implicitly stores functions as factories', function () {
    var registry = {}
    register(registry, 'foo', function () {})

    expect( registry ).to.have.property('foo')
    expect( registry.foo._tupperware ).to.be.true()
  })

  it('explicitly stores functions as values', function () {
    var registry = {}
    register(registry, 'foo', function () {}, { isValue: true })

    expect( registry ).to.have.property('foo')
    expect( registry.foo._tupperware ).to.be.undefined()
  })

})
