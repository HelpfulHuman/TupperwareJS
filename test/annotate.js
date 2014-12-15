var expect    = require('chai').expect
var annotate  = require('../lib/tupperware').annotate

describe('tupperware#annotate', function () {

  it('throws an error for a bad fn argument', function () {
    var testCall = function () {
      annotate('notafunction')
    }

    expect( testCall ).to.throw('Bad argument: fn')
  })

  it('returns an empty array if the function has no arguments', function () {
    var result = annotate( function () {} )

    expect( result ).to.be.an('array')
    expect( result.length ).to.equal(0)
  })

  it('returns an array of the function\'s argument names', function () {
    var result = annotate( function (a, b) {} )

    expect( result ).to.be.an('array')
    expect( result.length ).to.equal(2)
    expect( result[0] ).to.equal('a')
    expect( result[1] ).to.equal('b')
  })

})
