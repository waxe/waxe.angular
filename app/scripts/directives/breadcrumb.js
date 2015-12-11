'use strict';

/**
 * @ngdoc directive
 * @name waxeangularApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('waxeApp')
    .directive('breadcrumb', function () {
        return {
            template: '<ul class="breadcrumb"><li ng-repeat="file in files"><a ng-if="!$last || ($last && $first)" ng-href="#{{file.editUrl}}">{{file.name}}</a><span ng-if="$last && !$first">{{file.name}}</span></li></ul>',
            restrict: 'E',
            replace: true,
            scope: {
                'files': '=',
            }
        };
    });
