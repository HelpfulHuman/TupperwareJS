var expect  = require('chai').expect
var create  = require('../lib/tupperware').create

describe('tupperware#create', function () {

  it('returns a new container object with correct methods', function () {
    var container = create()

    expect( container ).to.be.an('object')
    expect( container ).to.have.property('set').that.is.a('function')
    expect( container ).to.have.property('get').that.is.a('function')
    expect( container ).to.have.property('inject').that.is.a('function')
    expect( container ).to.have.property('provide').that.is.a('function')
  })

})
