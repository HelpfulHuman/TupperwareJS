var expect  = require('chai').expect
var provide = require('../lib/tupperware').provide

describe('tupperware#provide', function () {

  it('throws an error for a bad registry argument', function () {
    var testCall = function () { provide('foo'); }

    expect( testCall ).to.throw('Bad argument: registry')
  })

  it('throws an error for a bad name argument ', function () {
    var testCall = function () { provide({}, false); }

    expect( testCall ).to.throw('Bad argument: name')
  })

  it('throws an error if it can\'t prepare a function', function () {
    var testCall = function () { provide({}, 'a'); }

    expect( testCall ).to.throw('Couldn\'t provide: a')
  })

  it('returns a simple "return value" function for values', function () {
    var registry = {
      foo: 'bar'
    }

    var result = provide(registry, 'foo')

    expect( result() ).to.equal('bar')
  })

  it('returns a wrapped injection function for containers', function () {
    var registry = {
      a: function () {
        return 'a'
      },
      b: function (a) {
        return a + 'b'
      }
    }
    registry.a._tupperware = true
    registry.b._tupperware = true

    var result = provide(registry, 'b')

    expect( result() ).to.equal('ab')
  })

})
