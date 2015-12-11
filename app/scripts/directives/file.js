'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:file
 * @description
 * # file
 */
angular.module('waxeApp')
    .directive('file', ['$location', 'UrlFactory', 'Session', function ($location, UrlFactory, Session) {
        return {
            template: '<div ng-class="containerClass"><input ng-if="checkbox" type="checkbox" ng-model="file.selected" class="file-checkbox" /><a href="" ng-click="click()"><i ng-class="file.iClass"></i>{{file.name}}</a></div>',
            restrict: 'E',
            scope: {
                'file': '=data',
            },
            require: '^files',
            link: function postLink(scope, element, attrs, filesCtrl) {
                scope.checkbox = filesCtrl.checkbox;
                scope.click = function() {
                    if (angular.isDefined(filesCtrl.action)) {
                        return filesCtrl.action()(scope.file);
                    }
                    else {
                        $location.url(scope.file.editUrl);
                    }
                };
                scope.$watch('file.selected', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (newValue === true) {
                            Session.filesSelected.push(scope.file);
                            scope.containerClass = 'file-selected';
                        }
                        else {
                            Session.filesSelected.splice(Session.filesSelected.indexOf(scope.file), 1);
                            scope.containerClass = '';
                        }
                    }
                });
            }
        };
    }]);
