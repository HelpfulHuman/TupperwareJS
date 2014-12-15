var expect  = require('chai').expect
var inject  = require('../lib/tupperware').inject

describe('tupperware#inject', function () {

  it('throws an error for a bad registry argument', function () {
    var testCall = function () { inject('notregistry'); }

    expect( testCall ).to.throw('Bad argument: registry')
  })

  it('throws an error for a bad fn argument ', function () {
    var testCall = function () { inject({}, 'notafunction'); }

    expect( testCall ).to.throw('Bad argument: fn')
  })

  it('calls a function with no dependencies', function () {
    var fn = function () { return 'foo'; }
    var result = inject({}, fn)

    expect( result ).to.be.a('string')
    expect( result ).to.equal('foo')
  })

  it('resolves a function\'s dependencies', function () {
    var registry = {
      a: function () {
        return 'a'
      }
    }
    registry.a._tupperware = true
    var b = function (a) { return a + 'b'; }

    var result = inject(registry, b)

    expect( result ).to.equal('ab')
  })

})
