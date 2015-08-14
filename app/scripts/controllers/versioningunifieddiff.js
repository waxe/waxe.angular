'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningUnifiedDiffCtrl
 * @description
 * # VersioningunifieddiffCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningUnifiedDiffCtrl', ['$scope', '$http', '$routeParams', '$modal', 'UrlFactory', 'MessageService', function ($scope, $http, $routeParams, $modal, UrlFactory, MessageService) {
        var url = UrlFactory.jsonAPIUserUrl('versioning/diff');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
                $scope.ok = (angular.isDefined(res.data.diff)? true: false);
                $scope.diff = res.data.diff;
                $scope.can_commit = res.data.can_commit;
                $scope.$emit('pageLoaded');
            });

        // TODO: refactor this with versioning.js, it's a copy/paste of
        // the code
        $scope.doCommit = function() {
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
                var filenames = [$routeParams.path];
                var url = UrlFactory.jsonAPIUserUrl('versioning/commit');
                $http
                    .post(url, {paths: filenames, msg: data.message})
                    .then(function(res) {
                        MessageService.set('success', res.data);
                        $scope.ok = false;
                    });
            });
        };

        // TODO: refactor this with versioning.js, it's a copy/paste of
        // the code
        $scope.doRevert = function() {
            var url = UrlFactory.jsonAPIUserUrl('versioning/revert');
            var filenames = [$routeParams.path];
            $http
                .post(url, {paths: filenames})
                .then(function(res) {
                    MessageService.set('success', res.data);
                    $scope.ok = false;
                });
        };
    }]);
