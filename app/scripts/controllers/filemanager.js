'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl',['$scope', '$http', '$routeParams', 'UrlFactory', 'AccountProfile', 'Session', function ($scope, $http, $routeParams, UrlFactory, AccountProfile, Session) {

        var url = UrlFactory.jsonAPIUserUrl('explore');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
            $scope.files = res.data;
            $scope.$emit('pageLoaded');
        });
        $scope.UrlFactory = UrlFactory;

        Session.showFileFilter = true;

        $scope.versioning = {};
        if (AccountProfile.has_versioning) {
            url = UrlFactory.jsonAPIUserUrl('versioning/short-status');
            $http
              .get(url, {params: $routeParams})
              .then(function(res) {
                $scope.versioning = res.data;
            });
        }

        $scope.opened_files = [];
        $scope.commited_files = [];
        url = UrlFactory.jsonAPIUrl(null, 'last-files');
        $http
          .get(url)
          .then(function(res) {
            $scope.opened_files = res.data.opened_files;
            $scope.commited_files = res.data.commited_files;
        });

    }]);
