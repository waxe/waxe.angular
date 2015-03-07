'use strict';

describe('Service: Userprofile', function () {

  // load the service's module
  beforeEach(module('waxeApp'));

  // instantiate service
  var Userprofile;
  beforeEach(inject(function (_Userprofile_) {
    Userprofile = _Userprofile_;
  }));

  it('should do something', function () {
    expect(!!Userprofile).toBe(true);
  });

});
