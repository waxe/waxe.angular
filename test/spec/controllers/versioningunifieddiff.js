'use strict';

describe('Controller: VersioningunifieddiffCtrl', function () {

  // load the controller's module
  beforeEach(module('waxeApp'));

  var VersioningunifieddiffCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersioningunifieddiffCtrl = $controller('VersioningunifieddiffCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
