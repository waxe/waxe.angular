'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Userprofile
 * @description
 * # Userprofile
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('ProfileManager', ['$q', '$http', 'UserProfile', 'AccountProfile', 'UrlFactory', 'Session', function ($q, $http, UserProfile, AccountProfile, UrlFactory, Session) {

        this.load = function(username) {
            var userProfileLoaded = angular.isDefined(UserProfile.login);

            var shouldLoadAccountProfile = false;
            if (angular.isDefined(username) && AccountProfile.login !== username) {
                shouldLoadAccountProfile = true;
            }

            if (! shouldLoadAccountProfile && userProfileLoaded) {
                // Make sure the login is set correctly.
                if (!angular.isDefined(username)) {
                    Session.init(UserProfile.login, false);
                }
                else {
                    Session.init(AccountProfile.login, true);
                }
                return $q.when(true);
            }


            if (shouldLoadAccountProfile) {
                var params = {};
                if (!userProfileLoaded) {
                    params = {full: true};
                }
                return $http
                    .get(UrlFactory.jsonAPIUrl(username, 'account-profile'), {params: params})
                    .then(function (res) {
                        if (!userProfileLoaded) {
                            UserProfile.create(res.data.user_profile);
                        }
                        AccountProfile.create(res.data.account_profile);
                        Session.load();
                    });
            }

            return $http
                .get(UrlFactory.jsonAPIUrl(null, 'profile'))
                .then(function (res) {
                    UserProfile.create(res.data);
                    Session.load();
                });
        };
    }])
    .service('UserProfile', function () {
        var keys = [];

        this.create = function (data) {
            for (var k in data) {
                keys.push(k);
                this[k] = data[k];
            }
        };

        this.destroy = function () {
            for (var i=0, len=keys.length; i < len; i++) {
                delete this[keys[i]];
            }
        };
    })
    .service('AccountProfile', function () {
        var keys = [];

        this.create = function (data) {
            for (var k in data) {
                keys.push(k);
                this[k] = data[k];
            }
        };

        this.destroy = function () {
            for (var i=0, len=keys.length; i < len; i++) {
                delete this[keys[i]];
            }
        };
    });
