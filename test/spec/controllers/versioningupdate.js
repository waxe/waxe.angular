'use strict';

describe('Controller: VersioningupdatectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('waxeApp'));

  var VersioningupdatectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersioningupdatectrlCtrl = $controller('VersioningupdatectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
