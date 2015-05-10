'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditTxtCtrl
 * @description
 * # EditTxtCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditTxtCtrl', function ($scope, $http, $sce, $routeParams, $route, $location, UrlFactory, Session, MessageService) {
        $scope.editorOptions = {
                lineWrapping : true,
                lineNumbers: true,
                // TODO: choose the mode according to the file
                mode: 'xml',
            };


        Session.hasForm = true;

        Session.submitForm = function() {
            var url = UrlFactory.getUserAPIUrl('txt/update');
            $http
                .post(url, {path: $routeParams.path, filecontent: $scope.txt})
                .then(function() {
                    MessageService.set('success', 'Saved!');
                });
        };

        var action = UrlFactory.getActionFromUrl($location.path());
        var url = UrlFactory.getUserAPIUrl('txt/' + action);
        $http
            .get(url, {params: $routeParams})
            .then(function(res) {
                $scope.txt = res.data;
            });
    });
