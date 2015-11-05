'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditTxtCtrl
 * @description
 * # EditTxtCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditTxtCtrl',['$scope', '$http', '$sce', '$routeParams', '$route', '$location', 'UrlFactory', 'Session', 'MessageService', 'NavbarService', function ($scope, $http, $sce, $routeParams, $route, $location, UrlFactory, Session, MessageService, NavbarService) {
        $scope.editorOptions = {
                lineWrapping : true,
                lineNumbers: true,
                // TODO: choose the mode according to the file
                mode: 'xml',
            };

        Session.submitForm = function() {
            var url = UrlFactory.jsonAPIUserUrl('txt/update');
            var params = {path: $routeParams.path, filecontent: $scope.txt};
            var conflicted = $location.search().conflicted;
            if (angular.isDefined(conflicted)) {
                params.conflicted = conflicted;
            }
            $http
                .post(url, params)
                .then(function() {
                    MessageService.set('success', 'Saved!');
                });
        };

        var action = $route.current.$$route.action;
        var url = UrlFactory.jsonAPIUserUrl('txt/' + action);
        $http
            .get(url, {params: $routeParams})
            .then(function(res) {
                $scope.txt = res.data;
                Session.filename = $routeParams.path;
                var hasFrom = angular.isDefined($routeParams.from);
                NavbarService.setEditFile(true, hasFrom);
                if (hasFrom) {
                    NavbarService.Source.selected = true;
                }
                $scope.$emit('pageLoaded');
            });
    }]);
