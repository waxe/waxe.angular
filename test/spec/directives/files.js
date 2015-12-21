'use strict';

describe('Directive: files', function () {

  // load the directive's module
  beforeEach(module('waxeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<files></files>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the files directive');
  }));
});
