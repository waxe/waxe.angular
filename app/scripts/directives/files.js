'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:files
 * @description
 * # files
 */
angular.module('waxeApp')
    .directive('files', function () {
        return {
            template: '<div ng-if="checkbox"> Select: <a href="" ng-click="selectAll()">All</a> / <a href="" ng-click="deselectAll()">None</a><br /></div><div class="col-md-6" ng-repeat="file in files" ng-class="\'versioning-\' + file.status"><file data="file" selected="selected"></file></div>',
            restrict: 'E',
            scope: {
                'files': '=data',
                'checkbox': '@',
                'action': '&'
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                if (angular.isDefined($attrs.action)) {
                    this.action = $scope.action;
                }
                this.checkbox = $scope.checkbox || false;
                $scope.selectAll = function() {
                    angular.forEach($scope.files, function(file) {
                        file.selected = true;
                    });
                };
                $scope.deselectAll = function() {
                    angular.forEach($scope.files, function(file) {
                        file.selected = false;
                    });
                };
            }]
        };
    });
