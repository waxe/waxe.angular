'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Auth
 * @description
 * # Auth
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('AuthService', function ($http, $q, UserProfile) {
        this.login = function (credentials) {
            return $http
                .post('/api/1/login.json', credentials)
                .then(function (res) {
                    UserProfile.create(res.data);
                });
        };

        this.logout = function (credentials) {
            return $http
                .post('/api/1/logout.json', credentials)
                .then(function () {
                    UserProfile.destroy();
                });
        };
        return this;
    });
