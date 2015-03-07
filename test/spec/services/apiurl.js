'use strict';

describe('Service: Apiurl', function () {

  // load the service's module
  beforeEach(module('waxeApp'));

  // instantiate service
  var Apiurl;
  beforeEach(inject(function (_Apiurl_) {
    Apiurl = _Apiurl_;
  }));

  it('should do something', function () {
    expect(!!Apiurl).toBe(true);
  });

});
