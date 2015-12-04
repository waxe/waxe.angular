'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:file
 * @description
 * # file
 */
angular.module('waxeApp')
    .directive('file', ['UrlFactory', 'Session', function (UrlFactory, Session) {
        return {
            template: '<div ng-class="containerClass"><input type="checkbox" ng-model="file.selected" class="file-checkbox" /><a ng-href="#{{file.editUrl}}"><i ng-class="file.iClass"></i>{{file.name}}</a></div>',
            restrict: 'E',
            scope: {
                'file': '=data',
            },
            link: function postLink(scope, element, attrs) {
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
