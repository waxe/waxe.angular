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

        var path = $location.search().file,
            search = $location.search().search,
            hash = $location.hash();

        var url = null;
        // Support path and search shortcut
        if (angular.isDefined(path)) {
            var file = File.loadFromPath(path);
            var data = $location.search();
            delete data.file;
            url = file._editUrl(data);
        }
        else if (angular.isDefined(search)){
            url = UrlFactory.userUrl('search', $location.search());
        }
        if (url !== null) {
            $location.url(url).hash(hash);
            return;
        }


        Files.query($routeParams.path).then(function(files) {
            $scope.files = Session.files = files;
            $scope.$emit('pageLoaded');
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
