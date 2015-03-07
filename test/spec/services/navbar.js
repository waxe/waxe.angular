'use strict';

describe('Service: Navbar', function () {

  // load the service's module
  beforeEach(module('waxeApp'));

  // instantiate service
  var Navbar;
  beforeEach(inject(function (_Navbar_) {
    Navbar = _Navbar_;
  }));

  it('should do something', function () {
    expect(!!Navbar).toBe(true);
  });

});
