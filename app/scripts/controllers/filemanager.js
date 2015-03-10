'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:FilemanagerCtrl
 * @description
 * # FilemanagerCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('FileManagerCtrl', function ($scope, $http, $routeParams, UrlFactory) {
        $http
          .get('/account/contributor/ng-explore.json', {params: $routeParams})
          .then(function(res) {
            $scope.files = res.data;
        });
        $scope.urlFor = UrlFactory.urlForUser($routeParams.user);
    });
