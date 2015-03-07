'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('LoginCtrl', function ($scope, AuthService, UserProfile) {

        $scope.UserProfile = UserProfile;

        $scope.credentials = {
            login: '',
            password: ''
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).catch(function(res) {
                alert(res.data);
            });
        };

        $scope.logout = function() {
            AuthService.logout().catch(function(res) {
                alert(res.data);
            });
        };
    });
