'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Auth
 * @description
 * # Auth
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('AuthService', function ($http, $q, UserProfile, UrlFactory, Session) {

        var init = false;

        this.login = function (credentials) {
            return $http
                .post(UrlFactory.getAPIUrl('login'), credentials)
                .then(function (res) {
                    UserProfile.create(res.data);
                    Session.init();
                    init = true;
                });
        };

        this.logout = function (credentials) {
            return $http
                .post(UrlFactory.getAPIUrl('logout'), credentials)
                .then(function () {
                    UserProfile.destroy();
                    Session.init();
                    init = false;
                });
        };

        this.profileLoaded = function() {
            if (init) {
                return $q.when(true);
            }
            init = true;
            return this.profile();
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
