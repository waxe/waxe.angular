'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Auth
 * @description
 * # Auth
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('AuthService', ['$http', '$q', 'UserProfile', 'AccountProfile', 'UrlFactory', 'Session', function ($http, $q, UserProfile, AccountProfile, UrlFactory, Session) {

        this.login = function (credentials) {
            return $http
                .post(UrlFactory.jsonAPIUrl(null, 'login'), credentials)
                .then(function (res) {
                    UserProfile.create(res.data);
                    Session.init();
                });
        };

        this.logout = function () {
            return $http
                .get(UrlFactory.jsonAPIUrl(null, 'logout'))
                .then(function () {
                    UserProfile.destroy();
                    AccountProfile.destroy();
                    Session.init();
                });
        };

        this.profile = function() {
            return $http
                .get(UrlFactory.jsonAPIUrl(null, 'profile'))
                .then(function (res) {
                    UserProfile.create(res.data);
                });
        };
        return this;
    }]);
