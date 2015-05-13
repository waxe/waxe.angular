'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('LoginCtrl', ['$scope', '$location', 'AuthService', 'UserProfile', function ($scope, $location, AuthService, UserProfile) {

        $scope.UserProfile = UserProfile;

        $scope.credentials = {
            login: '',
            password: ''
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function() {
                // In waiting we update the API, we make 2 requests
                AuthService.profile().then(function() {
                    var next = $location.search().next;
                    if (typeof next !== 'undefined') {
                        $location.url(next);
                    }
                    else {
                        $location.url('/');
                    }
                });
            });
        };
    }]);
