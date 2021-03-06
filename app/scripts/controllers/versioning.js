'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningCtrl
 * @description
 * # VersioningCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningCtrl', ['$scope', '$http', '$routeParams', '$location','$modal', 'AccountProfile', 'UrlFactory', 'MessageService', 'Files', function ($scope, $http, $routeParams, $location,  $modal, AccountProfile, UrlFactory, MessageService, Files) {

        if (!AccountProfile.has_versioning) {
            // TODO: error message
            // NOTE: the api should failed but make sure it's nicely handled.
        }



        var checkEmpty = function() {
            for (var k in $scope.versioning) {
                if($scope.versioning[k].length) {
                    return;
                }
            }
            $scope.emptyPage = true;
        };

        $scope.versioning = {};
        var url = UrlFactory.jsonAPIUserUrl('versioning/status');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
            $scope.versioning = {};
            $scope.versioning.conflicteds = Files.dataToObjs(res.data.conflicteds);
            $scope.versioning.uncommitables = Files.dataToObjs(res.data.uncommitables);
            $scope.versioning.others = Files.dataToObjs(res.data.others);
            $scope.$emit('pageLoaded');
            checkEmpty();
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


        var hasFilenameSelected = function(filenames) {
            for (var i=0, len=filenames.length; i < len; i++) {
                if (filenames[i].selected) {
                    return true;
                }
            }
            return false;
        };

        $scope.doRevert = function(filenames) {
            if (!hasFilenameSelected(filenames)) {
                MessageService.set('warning', 'Please select at least one file', undefined, 1000);
                return false;
            }

            var files = [],
                reals = [];
            for (var i=0, len=filenames.length; i < len; i++) {
                var filename = filenames[i];
                if (filename.selected === true) {
                    files.push(filename.relpath);
                    reals.push(filename);
                }
            }
            var url = UrlFactory.jsonAPIUserUrl('versioning/revert');
            $http
                .post(url, {paths: files})
                .then(function(res) {
                    angular.forEach(reals, function(filename) {
                        var index = filenames.indexOf(filename);
                        filenames.splice(index, 1);
                        MessageService.set('success', res.data);
                    });
                    checkEmpty();
                });
        };

        $scope.doCommit = function(filenames) {
            if (!hasFilenameSelected(filenames)) {
                MessageService.set('warning', 'Please select at least one file', undefined, 1000);
                return false;
            }

            var modalInstance = $modal.open({
                templateUrl: 'commit.html',
                controller: function($scope, $modalInstance) {

                    $scope.ok = function () {
                        $modalInstance.close({'message': $scope.message});
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });

            modalInstance.result.then(function(data) {
                var files = [],
                    reals = [];
                for (var i=0, len=filenames.length; i < len; i++) {
                    var filename = filenames[i];
                    if (filename.selected === true) {
                        files.push(filename.relpath);
                        reals.push(filename);
                    }
                }
                var url = UrlFactory.jsonAPIUserUrl('versioning/commit');
                $http
                    .post(url, {paths: files, msg: data.message})
                    .then(function(res) {
                        // TODO: we should also remove the folder commited
                        // implicitly when commiting file in.
                        angular.forEach(reals, function(filename) {
                            var index = filenames.indexOf(filename);
                            filenames.splice(index, 1);
                        });
                        MessageService.set('success', res.data);
                        checkEmpty();
                    });
            });
        };

        $scope.doDiff = function(filenames) {
            if (!hasFilenameSelected(filenames)) {
                MessageService.set('warning', 'Please select at least one file', undefined, 1000);
                return false;
            }

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
    }]);
