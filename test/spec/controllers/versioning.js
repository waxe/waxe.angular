'use strict';

describe('Controller: VersioningCtrl', function () {

  // load the controller's module
  beforeEach(module('waxeApp'));

  var VersioningCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersioningCtrl = $controller('VersioningCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
