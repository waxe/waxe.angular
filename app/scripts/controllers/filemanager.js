'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl',['$scope', '$http', '$routeParams', '$location', 'UrlFactory', 'AccountProfile', 'UserProfile', 'Session', 'Files', 'File', function ($scope, $http, $routeParams, $location, UrlFactory, AccountProfile, UserProfile, Session, Files, File) {

        var search = $location.search().search,
            hash = $location.hash();

        // Support search shortcut
        if (angular.isDefined(search)){
            var url = UrlFactory.userUrl('search', $location.search());
            $location.url(url).hash(hash);
            return;
        }

        Files.query($routeParams.path).then(function(files) {
            $scope.files = Session.files = files;
            $scope.$emit('pageLoaded');
        }, function(res) {
            if (res.status === 302) {
                // It's a file
                var file = File.loadFromPath($routeParams.path);
                $location.url(file.editUrl).hash(hash);
                return;
            }
        });

        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile = UserProfile;

        $scope.versioning = {};
        if (AccountProfile.has_versioning) {
            var url = UrlFactory.jsonAPIUserUrl('versioning/short-status');
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
            $scope.opened_files = Files.dataToObjs(res.data.opened_files);
            $scope.commited_files = Files.dataToObjs(res.data.commited_files);
        });
    }]);
