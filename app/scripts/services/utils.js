'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Utils
 * @description
 * # Utils
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('XmlUtils', ['$http', '$q', 'UrlFactory', function ($http, $q, UrlFactory) {
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
                .get(UrlFactory.getUserAPIUrl('xml/get-tags'), {params: {dtd_url: url}})
                .then(function (res) {
                    that._dtdTags[url] = res.data;
                    return res.data;
                });
        };

    }]).service('Utils', function () {
        this.getFormDataForSubmit = function($form) {
            var dic = {
                url: $form.data('action')
            };
            var lis = $form.serializeArray();
            var data = {};
            for (var i=0, len=lis.length; i < len; i++) {
                var d = lis[i];
                // TODO: support to have many values for one key.
                data[d.name] = d.value;
            }
            dic.data = data;
            return dic;
        };
        this.getBreadcrumbFiles = function(file, rootpath) {

            rootpath = typeof rootpath !== 'undefined'? rootpath: '';
            if (typeof file === 'undefined' || file === '' || file === null) {
                return [{name: 'root'}];
            }

            if (rootpath !== '' && file.indexOf(rootpath) === 0) {
                file = file.slice(rootpath.length);
                if (file.indexOf('/') === 0) {
                    file = file.slice(1);
                }
            }
            if (file === '') {
                return [{name: 'root'}];
            }

            var breadcrumbFiles = [{
                'name': 'root',
                'path': rootpath
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
