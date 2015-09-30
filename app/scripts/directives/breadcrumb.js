'use strict';

/**
 * @ngdoc directive
 * @name waxeangularApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('waxeApp')
    .directive('breadcrumb', ['$http', 'Session', '$routeParams', '$location', 'UrlFactory', function ($http, Session, $routeParams, $location, UrlFactory) {
        return {
            template: '<ul class="breadcrumb navbar-fixed-top" ng-if="session.breadcrumbFiles.length"><li><input type="text" ng-model="completion.path" typeahead-on-select="openFile($item)" placeholder="Search file" typeahead="path for path in getPaths($viewValue)" class="form-control" style="width: 100%" /></li><li ng-repeat="file in session.breadcrumbFiles"><a ng-if="isDefined(file.path)" href="#{{UrlFactory.userUrl(\'\', {path: file.path})}}">{{file.name}}</a><span ng-if="!isDefined(file.path)">{{file.name}}</span></li></ul>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope) {
                scope.session = Session;
                scope.UrlFactory = UrlFactory;
                scope.isDefined = angular.isDefined;
                scope.completion = {
                    path: ''
                };
                scope.getPaths = function(val) {
                    var url = UrlFactory.jsonAPIUserUrl('search/path-complete');
                    return $http.get(url, {
                        params: {
                            search: val,
                        }
                    }).then(function(response){
                        return response.data;
                    });
                };
                scope.openFile = function($item) {
                    scope.completion.path = '';
                    var url = UrlFactory.userUrl('xml/edit');
                    $location.path(url).search({path: $item});
                };
            }
        };
    }]);
