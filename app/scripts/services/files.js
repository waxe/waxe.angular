'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Files
 * @description
 * # Files
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('Files', ['$http', 'UrlFactory', 'MessageService', 'Session', function ($http, UrlFactory, MessageService, Session) {

        var getPaths = function(files) {
            var filenames = [];
            for(var i=0,len=files.length; i < len; i++) {
                filenames.push(files[i].path);
            }
            return filenames;
        };

        var httpRequest = function(method, url, path) {
            return $http[method](url, {params: {path: path}})
                .then(function(res) {
                    return res.data;
                });
        };

        this.query = function(path) {
            var url = UrlFactory.jsonAPIUserUrl('explore');
            return httpRequest('get', url, path);
        };

        this.move = function(files, newpath) {
            var url = UrlFactory.jsonAPIUserUrl('files/move');
            // TODO: the task can failed, it's possible some elements have been
            // moved, so we should reload files
            return $http.post(url, {paths: getPaths(files), newpath: newpath}).then(function() {
                angular.forEach(files, function(file) {
                    var index = Session.files.indexOf(file);
                    Session.files.splice(index, 1);
                    Session.filesSelected = [];
                });
                MessageService.set('success', 'Files moved!');
            });
        };

        this.delete = function(files) {
            var paths = getPaths(files);
            var url = UrlFactory.jsonAPIUserUrl('files', {paths: paths});

            // TODO: the task can failed, it's possible some elements have been
            // deleted, so we should reload files
            return $http
                .delete(url)
                .then(function() {
                    angular.forEach(files, function(file) {
                        var index = Session.files.indexOf(file);
                        Session.files.splice(index, 1);
                        Session.filesSelected = [];
                    });
                    MessageService.set('success', 'Files deleted!');
                });
        };

    }]);
