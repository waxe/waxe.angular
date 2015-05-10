'use strict';

describe('Controller: EdittxtctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('waxeApp'));

  var EdittxtctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdittxtctrlCtrl = $controller('EdittxtctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
