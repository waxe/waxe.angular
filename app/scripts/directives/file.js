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
            template: '<div ng-class="containerClass"><input type="checkbox" ng-model="file.selected" class="file-checkbox" /><a ng-href="#{{href}}"><i ng-class="iClass"></i>{{file.name}}</a></div>',
            restrict: 'E',
            scope: {
                'file': '=data',
            },
            link: function postLink(scope, element, attrs) {
                // TODO: Directive files should have a openFile and openFolder
                // function: in this way we can reuse the element in the modal.
                // Also toggleCheck should be an option
                scope.file.selected = false;

                if (scope.file.type === 'folder') {
                    scope.iClass = 'fa fa-folder-o';
                    scope.href = UrlFactory.userUrl('', {path: scope.file.path});
                }
                else {
                    scope.iClass = 'fa fa-file-excel-o';
                    scope.href = UrlFactory.userUrl('xml/edit', {path: scope.file.path});
                }

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
