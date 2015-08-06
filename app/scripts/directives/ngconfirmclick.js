'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:ngConfirmClick
 * @description
 * # ngConfirmClick
 */
angular.module('waxeApp')
.directive('ngConfirmClick', function () {
    return {
        priority: 1,
        terminal: true,
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var msg = attrs.ngConfirmClick || 'Are you sure?';
            var clickAction = attrs.ngClick;
            element.bind('click', function() {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction);
                }
            });
        }
    };
});
