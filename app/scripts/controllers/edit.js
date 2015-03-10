'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditCtrl', function ($scope, $http, $sce, $routeParams) {
        $http
            .get('/account/contributor/xml/edit.json', {params: $routeParams})
            .then(function(res) {
                $scope.html = $sce.trustAsHtml(res.data.content);
                $scope.treeData = res.data.jstree_data;
            });
    });
