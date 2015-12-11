'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Files
 * @description
 * # Files
 * Service in the waxeApp.
 */




angular.module('waxeApp')
    .factory('FS', function() {
        var FS = function(data) {
            this.init(data);
        };

        FS.prototype.init = function(data) {
            this.status = false;  // Versioning status
            this.selected = false;  // If it is selected by checkbox

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        };
        FS.prototype._editUrl = function() {
            throw new Error('NotImplemented');
        };

        Object.defineProperty(FS.prototype, 'editUrl', {
            get: function editUrlProperty() {
                return this._editUrl();
            }
        });
        return FS;
    })
    .factory('Folder', ['FS', 'UrlFactory', function(FS, UrlFactory) {
        var Folder = function(data){
            this.init(data);
            this.iClass = 'fa fa-folder-o';
        };
        Folder.prototype = new FS();
        Folder.prototype._editUrl = function() {
            return UrlFactory.userUrl('', {path: this.path});
        };
        return Folder;
    }])
    .factory('File', ['FS', 'UrlFactory', function(FS, UrlFactory) {
        var File = function(data){
            this.init(data);
            this.iClass = 'fa fa-file-excel-o';
        };
        File.prototype = new FS();
        File.prototype._editUrl = function() {
            var url = this.editor + '/edit';
            return UrlFactory.userUrl(url, {path: this.path});
        };
        return File;
    }])
    .service('Files', ['$http', 'UrlFactory', 'MessageService', 'Session', 'Folder', 'File', function ($http, UrlFactory, MessageService, Session, Folder, File) {

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
                    return res.data.map(function(value) {
                        if(value.type === 'folder') {
                            return new Folder(value);
                        }
                        else {
                            return new File(value);
                        }
                    });
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