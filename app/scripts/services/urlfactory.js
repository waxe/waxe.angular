'use strict';

/**
 * @ngdoc service
 * @name waxeApp.UrlFactory
 * @description
 * # UrlFactory
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .factory('UrlFactory', ['Session', function (Session) {

        return {
            getAPIUrl: function(key) {
                var url = API_BASE_PATH;
                if (key.indexOf('/') !== 0) {
                    url += '/';
                }
                return url + key + '.json';
            },
            getAPIUrlFor: function(user, name, params) {
                var url = this.urlFor(user, name, params);
                return this.getAPIUrl(url);
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
            getTypeFromUrl: function(url) {
                var lis = url.split('/');
                return lis[lis.length - 2];
            },
            urlFor: function (user, name, params) {
                var u = '/account/' + user;
                if (angular.isDefined(name)) {
                    u+= '/' + name;
                }
                if (typeof params !== 'undefined') {
                    u += '?path=' + params.path;

                    // TODO: use angular location to generate url
                    if (angular.isDefined(params.conflicted)) {
                        u += '&conflicted=true';
                    }
                }
                return u;
            },
            userUrl: function(name, params) {
                return this.urlFor(Session.login, name, params);
            }
        };
    }]);
