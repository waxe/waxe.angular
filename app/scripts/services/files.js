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
    .factory('File', ['FS', 'UrlFactory', 'AccountProfile', function(FS, UrlFactory, AccountProfile) {
        var File = function(data){
            this.init(data);
            this.iClass = 'fa fa-file-excel-o';
        };
        File.prototype = new FS();
        File.prototype._editUrl = function(data) {
            var url = this.editor + '/edit';
            data = data || {};
            data.path = this.path;
            if (angular.isDefined(this.user) && this.user) {
                // On opened and commited file it can be a link to another account.
                return UrlFactory.url(this.user, url, data);
            }
            return UrlFactory.userUrl(url,data);
        };
        File.prototype.init = function(data) {
            FS.prototype.init.call(this, data);
            if (! angular.isDefined(this.name)) {
                this.name = this.path.substring(this.path.lastIndexOf('/')+1, this.path.length);
            }
            this.extension = this.name.substring(this.name.lastIndexOf('.'), this.name.length).toLowerCase();
            this.editor = AccountProfile.editors[this.extension];
            this.renderer = AccountProfile.renderers[this.extension];
        };
        Object.defineProperty(File.prototype, 'newUrl', {
            get: function newUrlProperty() {
                var url = this.editor + '/new';
                return UrlFactory.userUrl(url, {path: this.path});
            }
        });

        Object.defineProperty(File.prototype, 'viewUrl', {
            get: function viewUrlProperty() {
                var url = this.renderer + '/view';
                return UrlFactory.jsonAPIUserUrl(url, {path: this.path});
            }
        });

        File.loadFromPath = function(path) {
            var data = {
                'name': path.substring(path.lastIndexOf('/')+1, path.length),
                'path': path,
            };
            return new File(data);
        };
        return File;
    }])
    .service('Files', ['$http', '$q', 'UrlFactory', 'MessageService', 'Session', 'Folder', 'File', function ($http, $q, UrlFactory, MessageService, Session, Folder, File) {

        var that = this;
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
                    if (!angular.isDefined(res) || ! angular.isDefined(res.data)) {
                        return $q.reject(res);
                    }
                    return that.dataToObjs(res.data);
                });
        };

        this.dataToObjs = function(data) {
            return data.map(function(value) {
                if(value.type === 'folder') {
                    return new Folder(value);
                }
                else {
                    return new File(value);
                }
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
                });
                Session.unSelectFiles();
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
                    });
                    Session.unSelectFiles();
                    MessageService.set('success', 'Files deleted!');
                });
        };

    }]);
