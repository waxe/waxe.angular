'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Utils
 * @description
 * # Utils
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('XmlUtils', function ($http, $q, UrlFactory) {
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

    }).service('Utils', function () {
        this.getBreadcrumbFiles = function(file) {
            if (typeof file === 'undefined' || file === '' || file === null) {
                return [{name: 'root'}];
            }

            var breadcrumbFiles = [{
                'name': 'root',
                'path': ''
            }];
            var lis = file.split('/');
            var path = '';
            for (var i=0, len=lis.length; i < len; i++) {
                if (i > 0) {
                    path += '/';
                }
                path += lis[i];
                var o = {
                    'name': lis[i]
                };
                if (i < len -1) {
                    o.path = path;
                }
                breadcrumbFiles.push(o);
            }
            return breadcrumbFiles;
        };
    });
