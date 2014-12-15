var expect  = require('chai').expect
var resolve = require('../lib/tupperware').resolve

describe('tupperware#resolve', function () {

  it('throws an error for a bad registry argument', function () {
    var testCall = function () { resolve('foo'); }

    expect( testCall ).to.throw('Bad argument: registry')
  })

  it('throws an error for a bad name argument', function () {
    var testCall = function () { resolve({}, false); }

    expect( testCall ).to.throw('Bad argument: name')
  })

  it('throws an error if it can\'t resolve a dependency', function () {
    var testCall = function () { resolve({}, 'a'); }

    expect( testCall ).to.throw('Can\'t resolve dependency: a')
  })

  it('injects `null` if it can\'t resolve an optional dependency', function () {
    var registry = {
      b: function (a) {
        return a
      }
    }
    registry.b._tupperware = true

    var options = { optional: ['a'] }
    var result = resolve(registry, 'b', options)

    expect( result ).to.be.null()
  })

  it('resolves a simple container with no dependencies', function () {
    var registry = {
      a: function () {
        return 'a'
      }
    }
    registry.a._tupperware = true

    var result = resolve(registry, 'a')

    expect( result ).to.equal('a')
  })

  it('resolves a container with dependencies', function () {
    var registry = {
      a: function () {
        return 'a'
      },
      b: function (a) {
        return a + 'b'
      },
      c: function (b) {
        return b + 'c'
      }
    }
    registry.a._tupperware = true
    registry.b._tupperware = true
    registry.c._tupperware = true

    var result = resolve(registry, 'c')

    expect( result ).to.equal('abc')
  })

  it('throws an error on a circular dependency', function () {
    var registry = {
      a: function (b) {
        return 'a' + a
      },
      b: function (a) {
        return a + 'b'
      }
    }
    registry.a._tupperware = true
    registry.b._tupperware = true
    var testCase = function () { resolve(registry, 'a'); }

    expect( testCase ).to.throw('Circular dependency error: a')
  })

  it('resolves containers as singletons', function () {
    var counter = 0
    var registry = {
      a: function () {
        counter++
        return counter
      }
    }
    registry.a._tupperware = true

    var result1 = resolve(registry, 'a')
    var result2 = resolve(registry, 'a')

    expect( counter ).to.equal(1)
    expect( result1 ).to.equal(1)
    expect( result2 ).to.equal(1)
  })

  it('resolves Factory suffixed arguments as factories', function () {
    var counter = 0
    var registry = {
      count: function () {
        counter++
        return counter
      }
    }
    registry.count._tupperware = true

    var countFactory = resolve(registry, 'countFactory')

    expect( countFactory ).to.be.an('object')
    expect( countFactory ).to.have.property('make').that.is.a('function')

    var result1 = countFactory.make()
    var result2 = countFactory.make()

    expect( result1 ).to.equal(1)
    expect( result2 ).to.equal(2)
    expect( counter ).to.equal(2)
  })

})
