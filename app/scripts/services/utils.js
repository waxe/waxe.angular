'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Utils
 * @description
 * # Utils
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('Utils', function ($http, $q, UrlFactory) {
        this._dtdTags = {};
        this.getDtdTags = function(url) {
            if (url in this._dtdTags) {
                // We need a promise to do like $http.get
                var deferred = $q.defer();
                deferred.resolve(this._dtdTags[url]);
                return deferred.promise;
            }
            this._dtdTags[url] = [];
            var that = this;
            return $http
                .get(UrlFactory.getAPIUrl('xml/get-tags'), {params: {url: url}})
                .then(function (res) {
                    that._dtdTags[url] = res.data;
                    return res.data;
                });
        };
    });
