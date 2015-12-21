'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningUpdateCtrl
 * @description
 * # VersioningupdatectrlCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningUpdateCtrl', ['$scope', '$http', 'UrlFactory', 'MessageService', 'Files', function ($scope, $http, UrlFactory, MessageService, Files) {

        var url = UrlFactory.jsonAPIUserUrl('versioning/update');
        $http
          .get(url)
          .then(function(res) {
            $scope.files = Files.dataToObjs(res.data);
            $scope.length = $scope.files.length;
            $scope.$emit('pageLoaded');
        });
    }]);
