'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Auth
 * @description
 * # Auth
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('AuthService', function ($http, $q, UserProfile, APIUrl) {
        this.login = function (credentials) {
            return $http
                .post(APIUrl.getUrl('login'), credentials)
                .then(function (res) {
                    UserProfile.create(res.data);
                });
        };

        this.logout = function (credentials) {
            return $http
                .post(APIUrl.getUrl('logout'), credentials)
                .then(function () {
                    UserProfile.destroy();
                });
        };
        return this;
    });
