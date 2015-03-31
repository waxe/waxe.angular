'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:diff
 * @description
 * # diff
 */
angular.module('waxeApp')
    .directive('diff', function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element) {
                var listener = scope.$watch(function(scope){
                    if(scope.html) {
                        element.html(scope.html);
                        listener();
                    }
                });
            }
        };
    });
