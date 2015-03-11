'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Apiurl
 * @description
 * # Apiurl
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .factory('UrlFactory', function () {

        return {
            getAPIUrl: function(key) {
                return '/api/1/' + key + '.json';
            },

            urlFor: function (user, name, params) {
                var u = '/account/' + user + '/' + name;
                if (typeof params !== 'undefined') {
                    u += '?path=' + params.path;
                }
                return u;
            },
            urlForUser: function(user) {
                var that = this;
                return function(name, params) {
                    return that.urlFor(user, name, params);
                };
            }
        };
    });
