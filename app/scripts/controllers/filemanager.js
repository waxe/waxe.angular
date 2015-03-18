'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl', function ($scope, $http, $routeParams, UrlFactory, Session, UserProfile) {
        Session.updateFromRouteParams($routeParams);

        var url = UrlFactory.getUserAPIUrl('ng-explore');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
            $scope.files = res.data;
        });
        $scope.UrlFactory = UrlFactory;

        $scope.versioning = {};
        if (UserProfile.versioning) {
            url = UrlFactory.getUserAPIUrl('versioning/short-status');
            $http
              .get(url, {params: $routeParams})
              .then(function(res) {
                $scope.versioning = res.data;
            });
        }

    });
