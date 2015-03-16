'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Apiurl
 * @description
 * # Apiurl
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .factory('UrlFactory', function (Session) {

        return {
            getAPIUrl: function(key) {
                return '/api/1/' + key + '.json';
            },

            getUserAPIUrl: function(key) {
                return this.getAPIUrl(this.userUrl(key));
            },
            getActionFromUrl: function(url) {
                // The action is the last past of the url
                // We assume we never pass the query string in url.
                var lis = url.split('/');
                return lis[lis.length - 1];
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
            },
            userUrl: function(name, params) {
                return this.urlFor(Session.user, name, params);
            }
        };
    });
