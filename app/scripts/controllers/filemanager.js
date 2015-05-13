'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl',['$scope', '$http', '$routeParams', 'UrlFactory', 'UserProfile' , function ($scope, $http, $routeParams, UrlFactory, UserProfile) {

        var url = UrlFactory.getUserAPIUrl('explore');
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

    }]);
