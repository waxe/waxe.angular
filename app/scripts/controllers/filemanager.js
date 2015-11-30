'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl',['$scope', '$http', '$routeParams', 'UrlFactory', 'AccountProfile', 'UserProfile', 'Session', function ($scope, $http, $routeParams, UrlFactory, AccountProfile, UserProfile, Session) {

        var url = UrlFactory.jsonAPIUserUrl('explore');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
            $scope.files = Session.files = res.data;
            $scope.$emit('pageLoaded');
        });
        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile = UserProfile;

        $scope.versioning = {};
        if (AccountProfile.has_versioning) {
            url = UrlFactory.jsonAPIUserUrl('versioning/short-status');
            $http
              .get(url, {params: $routeParams})
              .then(function(res) {
                $scope.versioning = res.data;
                // TODO: we should be sure explore request is finished before
                // calling this
                angular.forEach($scope.files, function(file) {
                    file.status = $scope.versioning[file.path];
                });
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
