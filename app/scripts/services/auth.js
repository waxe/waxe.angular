'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Auth
 * @description
 * # Auth
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('AuthService', function ($http, $q, UserProfile, UrlFactory) {
        this.login = function (credentials) {
            return $http
                .post(UrlFactory.getAPIUrl('login'), credentials)
                .then(function (res) {
                    UserProfile.create(res.data);
                });
        };

        this.logout = function (credentials) {
            return $http
                .post(UrlFactory.getAPIUrl('logout'), credentials)
                .then(function () {
                    UserProfile.destroy();
                });
        };

        this.profile = function() {
            return $http
                .get(UrlFactory.getAPIUrl('profile'))
                .then(function (res) {
                    UserProfile.create(res.data);
                });
        };
        return this;
    });
