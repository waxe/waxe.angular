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
            template: '<div class="breadcrumb"><li ng-repeat="file in session.breadcrumbFiles"><a ng-if="file.link" href="#{{file.link}}">{{file.name}}</a><span ng-if="!file.link">{{file.name}}</span></li></div>',
            restrict: 'E',
            link: function postLink(scope) {
                scope.session = Session;
                scope.urlFor = UrlFactory.urlFor;
            }
        };
    });
