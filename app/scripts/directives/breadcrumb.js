'use strict';

/**
 * @ngdoc directive
 * @name waxeangularApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('waxeApp')
    .directive('breadcrumb', ['$location', function ($location) {
        return {
            template: '<ul class="breadcrumb"><li ng-repeat="file in files"><a ng-if="!$last || ($last && $first)" href="" ng-click="open(file)">{{file.name}}</a><span ng-if="$last && !$first">{{file.name}}</span></li></ul>',
            restrict: 'E',
            replace: true,
            scope: {
                'files': '=',
                'action': '&'
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                $scope.open = function(file) {
                    if (angular.isDefined($attrs.action)) {
                        $scope.action()(file);
                    }
                    else {
                        $location.url(file.editUrl);
                    }
                };
            }]
        };
    }]);
