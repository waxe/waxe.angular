'use strict';

/**
 * @ngdoc directive
 * @name waxeangularApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('waxeApp')
    .directive('breadcrumb', function (Session, $routeParams, UrlFactory) {
        return {
            template: '<div class="breadcrumb" ng-if="session.breadcrumbFiles.length"><li ng-repeat="file in session.breadcrumbFiles"><a ng-if="isDefined(file.path)" href="#{{UrlFactory.userUrl(\'\', {path: file.path})}}">{{file.name}}</a><span ng-if="!isDefined(file.path)">{{file.name}}</span></li></div>',
            restrict: 'E',
            link: function postLink(scope) {
                scope.session = Session;
                scope.UrlFactory = UrlFactory;
                scope.isDefined = angular.isDefined;
            }
        };
    });
