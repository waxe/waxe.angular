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
            template: '<div ng-if="checkbox"> Select: <a href="" ng-click="selectAll()">All</a> / <a href="" ng-click="deselectAll()">None</a><br /></div><div class="col-md-{{colMd}}" ng-repeat="file in files" ng-class="\'versioning-\' + file.status"><file data="file" selected="selected"></file></div>',
            restrict: 'E',
            scope: {
                'files': '=data',
                'checkbox': '@',
                'action': '&',
                'display': '@',
                'col': '@'
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                if (angular.isDefined($attrs.col)) {
                    $scope.colMd = 12 / $scope.col;
                }
                else {
                    // 2 cols  by default
                    $scope.colMd = 6;
                }

                if (angular.isDefined($attrs.action)) {
                    this.action = $scope.action;
                }

                if (angular.isDefined($attrs.display)) {
                    this.display = $attrs.display;
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
