'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('LoginCtrl', function ($scope, $location, AuthService, UserProfile, MessageService) {

        $scope.UserProfile = UserProfile;

        $scope.credentials = {
            login: '',
            password: ''
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function() {
                var next = $location.search().next;
                if (typeof next !== 'undefined') {
                    $location.url(next);
                }
                else {
                    $location.url('/');
                }
            }, function(res) {
                MessageService.set('danger', res.data);
            });
        };
    });
