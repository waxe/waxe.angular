'use strict';

describe('Directive: diff', function () {

  // load the directive's module
  beforeEach(module('waxeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<diff></diff>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the diff directive');
  }));
});
