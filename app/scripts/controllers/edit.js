'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditCtrl', function ($scope, $http, $sce, $routeParams, $route, $location, UrlFactory, Session) {

        Session.updateFromRouteParams($routeParams);

        var action = UrlFactory.getActionFromUrl($location.path());
        var url = UrlFactory.getUserAPIUrl($routeParams.type+'/'+action);
        $http
            .get(url, {params: $routeParams})
            .then(function(res) {
                $scope.html = $sce.trustAsHtml(res.data.content);
                $scope.treeData = res.data.jstree_data;
            });
    });
