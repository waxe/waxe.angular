'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditCtrl', ['$scope', '$http', '$sce', '$routeParams', '$route', '$location', 'UrlFactory', 'Session' , function ($scope, $http, $sce, $routeParams, $route, $location, UrlFactory, Session) {

        var action = UrlFactory.getActionFromUrl($location.path());

        var url = UrlFactory.getUserAPIUrl($routeParams.type+'/'+action);
        $http
            .get(url, {params: $routeParams})
            .then(function(res) {
                $scope.html = $sce.trustAsHtml(res.data.content);
                $scope.treeData = res.data.jstree_data;
                Session.hasForm = true;
            }, function() {
                // Seems like there is a problem to display the XML file, we
                // try to display it as txt.
                // TODO: Do not redirect on 404
                var redirect = UrlFactory.userUrl('txt/'+action);
                var path = $location.path();
                $location.path(redirect).search({path: $routeParams.path, from: path, fromtype: 'source'});
            });
    }]);
