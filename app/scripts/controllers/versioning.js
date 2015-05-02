'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningCtrl
 * @description
 * # VersioningCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningCtrl', function ($scope, $http, $routeParams, $location,  UserProfile, UrlFactory) {

        if (!UserProfile.versioning) {
            // TODO: error message
            // NOTE: the api should failed but make sure it's nicely handled.
        }

        $scope.versioning = {};
        var url = UrlFactory.getUserAPIUrl('versioning/status');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
            $scope.versioning = res.data;
        });

        $scope.selectAll = function(filenames) {
            angular.forEach(filenames, function(filename) {
                filename.selected = true;
            });
        };

        $scope.deselectAll = function(filenames) {
            angular.forEach(filenames, function(filename) {
                filename.selected = false;
            });
        };

        $scope.doRevert = function(filenames) {
            var files = [],
                reals = [];
            for (var i=0, len=filenames.length; i < len; i++) {
                var filename = filenames[i];
                if (filename.selected === true) {
                    files.push(filename.relpath);
                    reals.push(filename);
                }
            }
            var url = UrlFactory.getUserAPIUrl('versioning/revert');
            $http
                .post(url, {filenames: files})
                .then(function() {
                    angular.forEach(reals, function(filename) {
                        var index = filenames.indexOf(filename);
                        filenames.splice(index, 1);
                    });
                });
        };

        $scope.doRemove = function(filenames) {
            var files = [],
                reals = [];
            for (var i=0, len=filenames.length; i < len; i++) {
                var filename = filenames[i];
                if (filename.selected === true) {
                    files.push(filename.relpath);
                    reals.push(filename);
                }
            }
            var url = UrlFactory.getUserAPIUrl('remove');
            $http
                .post(url, {paths: files})
                .then(function() {
                    angular.forEach(reals, function(filename) {
                        var index = filenames.indexOf(filename);
                        filenames.splice(index, 1);
                    });
                });
        };

        $scope.doDiff = function(filenames) {
            var files = [];
            for (var i=0, len=filenames.length; i < len; i++) {
                var filename = filenames[i];
                if (filename.selected === true) {
                    files.push(filename.relpath);
                }
            }
            var url = UrlFactory.userUrl('versioning/diff');
            $location.path(url).search({paths: files});
        };
    });
