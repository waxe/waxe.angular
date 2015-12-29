'use strict';


/**
 * @ngdoc service
 * @name waxeApp.UrlFactory
 * @description
 * # UrlFactory
 * Functions to generate the url for angular and to call the API
 */
angular.module('waxeApp')
    .factory('UrlFactory', ['Session', function (Session) {

        var api_base_path = '/api/1';
        if (typeof(API_BASE_PATH) !== 'undefined') {
            // API_BASE_PATH should be defined in the template but we also need
            // it to be defined in the tests.
            api_base_path = API_BASE_PATH;
        }

        return {
            /**
             * @ngdoc method
             * @name _generateUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} username the username we want to use to generate the url
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url
             *
             * @description:
             * Generate the url corresponding to the given parameters. If this
             * url is prefixed by:
             *   * '#' it can be used as angular link
             *   * API_BASE_PATH it can be used to call the API
             *
             *
             * This is an internal function, do not use it directly.
             */
            _generateUrl: function (username, routename, params, hash) {
                var u = '';
                if (username) {
                    u = '/account/' + username;
                }
                if (angular.isDefined(routename)) {
                    u += '/' + routename;
                }
                if (angular.isDefined(params)) {
                    var lis = [];
                    angular.forEach(params, function(value, key) {
                        if (typeof value === 'string') {
                            value = [value];
                        }
                        angular.forEach(value, function(v) {
                            lis.push(key + '=' + encodeURIComponent(v));
                        });
                    });
                    u += '?' + lis.join('&');
                }
                if (angular.isDefined(hash) && hash) {
                    u += '#' + hash;
                }
                return u;
            },
            /**
             * @ngdoc method
             * @name _generateUserUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url
             *
             * @description:
             *
             * Generate the url corresponding to the given parameters.
             * Basically same function as {@link waxeApp.UrlFactory#methods__generateUrl _generateUrl}.
             * The only difference is the username which comes from the Session
             *
             * If this url is prefixed by:
             *   * '#' it can be used as angular link
             *   * API_BASE_PATH it can be used to call the API
             *
             *
             * This is an internal function, do not use it directly.
             */
            _generateUserUrl: function() {
                var args = [];
                args.push(Session.login);
                args.push.apply(args, arguments);
                return this._generateUrl.apply(this, args);
            },
            /**
             * @ngdoc method
             * @name url
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} username the username we want to use to generate the url
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url
             *
             * @description:
             * Generate an url to use in angular, starting with '#'
             */
            url: function() {
                return this._generateUrl.apply(this, arguments);
            },
            /**
             * @ngdoc method
             * @name userUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url
             *
             * @description:
             * Generate an url to use in angular. The username comes from the
             * Session.
             */
            userUrl: function() {
                return this._generateUserUrl.apply(this, arguments);
            },
            /**
             * @ngdoc method
             * @name _generateAPIUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} url the url to prefix by the API path
             * @returns {string} A relative url used to call the API
             *
             * @description:
             * Prefix the given url by the API path
             *
             * This is an internal function, do not use it directly.
             */
            _generateAPIUrl: function(url) {
                var u = api_base_path;
                if (url.indexOf('/') !== 0) {
                    u += '/';
                }
                return u + url;
            },
            /**
             * @ngdoc method
             * @name APIUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} username the username we want to use to generate the url
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url used to call the API
             *
             * @description:
             * Generate an url to call the API
             */
            APIUrl: function() {
                var url = this._generateUrl.apply(this, arguments);
                return this._generateAPIUrl(url);
            },
            /**
             * @ngdoc method
             * @name APIUserUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url used to call the API
             *
             * @description:
             * Generate an url to call the API
             */
            APIUserUrl: function() {
                var url = this._generateUserUrl.apply(this, arguments);
                return this._generateAPIUrl(url);
            },
            /**
             * @ngdoc method
             * @name jsonAPIUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} username the username we want to use to generate the url
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url used to call the API
             *
             * @description:
             * Generate an url to call the API
             */
            jsonAPIUrl: function() {
                arguments[1] += '.json';
                var url = this._generateUrl.apply(this, arguments);
                return this._generateAPIUrl(url);
            },
            /**
             * @ngdoc method
             * @name jsonAPIUserUrl
             * @methodOf waxeApp.UrlFactory
             * @private
             *
             * @param {string} username the username we want to use to generate the url
             * @param {string=} routename the name of the route we want to go
             * @param {object=} params the values to put in the query string
             * @returns {string} A relative url used to call the API
             *
             * @description:
             * Generate an url to call the API
             */
            jsonAPIUserUrl: function() {
                arguments[0] += '.json';
                var url = this._generateUserUrl.apply(this, arguments);
                return this._generateAPIUrl(url);
            },
        };
    }]);
