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
        this.getDtdTags = function(url, text) {
            text = (typeof text === 'undefined')?false:text;

            if (!(text in this._dtdTags)) {
                this._dtdTags[text] = {};
            }
            if (url in this._dtdTags[text]) {
                // We need a promise to do like $http.get
                var deferred = $q.defer();
                deferred.resolve(this._dtdTags[text][url]);
                return deferred.promise;
            }
            this._dtdTags[text][url] = [];
            var that = this;
            var params = {dtd_url: url};
            if(text) {
                params.text = text;
            }
            return $http
                .get(UrlFactory.jsonAPIUserUrl('xml/get-tags'), {params: params})
                .then(function (res) {
                    that._dtdTags[text][url] = res.data;
                    return res.data;
                });
        };

    }]).service('Utils', ['$injector', function ($injector) {
        var Folder;


        this.getFormDataForSubmit = function($form) {
            var dic = {
                url: $form.data('action')
            };
            var lis = $form.serializeArray();
            var data = {};
            for (var i=0, len=lis.length; i < len; i++) {
                var d = lis[i];
                // TODO: support to have many values for one key.
                // NOTE: serializeArray add some CR, we remove them to keep
                // unix format.
                data[d.name] = d.value.replace(/\r/g, '');
            }
            dic.data = data;
            return dic;
        };

        this.getBreadcrumbFiles = function(file, rootpath) {
            // HACK: to avoid circular dependency we need to inject Folder here.
            // TODO: Update the code to avoid circular dependency
            if (!Folder) { Folder = $injector.get('Folder');}

            rootpath = typeof rootpath !== 'undefined'? rootpath: '';
            if (rootpath !== '' && file.indexOf(rootpath) === 0) {
                file = file.slice(rootpath.length);
                if (file.indexOf('/') === 0) {
                    file = file.slice(1);
                }
            }
            if (typeof file === 'undefined' || file === '' || file === null) {
                // We always add link on the root path to make the easier when
                // we are not on filemanager page
                return [new Folder({name: 'root', 'path': rootpath})];
            }

            var breadcrumbFiles = [new Folder({
                'name': 'root',
                'path': rootpath
            })];
            var lis = file.split('/');
            var path = '';
            for (var i=0, len=lis.length; i < len; i++) {
                if (i > 0) {
                    path += '/';
                }
                path += lis[i];
                var o = new Folder({
                    'name': lis[i],
                    'path': path
                });
                breadcrumbFiles.push(o);
            }
            return breadcrumbFiles;
        };

    }]).service('FileUtils', ['$http', '$location', '$modal', 'Session', 'MessageService', 'UrlFactory', 'Utils', 'Files', function ($http, $location, $modal, Session, MessageService, UrlFactory, Utils, Files) {
        var that = this;
        this.save = function() {
            // TODO: if we keep this logic we should refactor this function.
            if (Session.submitForm) {
                Session.submitForm();
                return;
            }

            if (!Session.form.filename) {
                that.saveasModal();
                return;
            }
            var dic = Utils.getFormDataForSubmit(Session.form.$element);
            return $http
                .post(dic.url, dic.data)
                .then(function() {
                    if (Session.form) {
                        // When we save before destroying the form
                        // Session.form can be already deleted
                        Session.form.status = null;
                    }
                    MessageService.set('success', 'Saved!');
                });
        };

        this.saveasModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'navbar-saveas.html',
                controller: ['$scope', '$modalInstance', '$controller', 'Folder', function($scope, $modalInstance, $controller, Folder) {
                    $controller('BaseModalCtrl', {
                        $scope: $scope,
                        $modalInstance: $modalInstance
                    });

                    $scope.folder = '';
                    $scope.filename = '';
                    $scope.showCreateFolder = false;

                    $scope.createFolder = function() {
                        var url = UrlFactory.jsonAPIUserUrl('create-folder');
                        $http
                          .post(url, {path: Session.currentPath,
                                              name: $scope.folder})
                          .then(function(res) {
                            $scope.open(new Folder(res.data));
                            $scope.folder = '';
                            $scope.showCreateFolder = false;
                        });
                    };

                    // Overwrite openFile method since we don't want to edit
                    // the file here
                    $scope.openFile = function(file) {
                        $scope.filename = file.name;
                        angular.element('.modal-filename').focus();
                    };

                    $scope.saveAs = function() {
                        var filename = $scope.filename;
                        if (! filename) {
                            return;
                        }
                        var ok = true;
                        angular.forEach($scope.files, function(file) {
                            if (file.name === filename) {
                                if (! window.confirm('Are you sure you want to replace the existing file?')) {
                                    ok = false;
                                    return false;
                                }
                            }
                        });
                        if (!ok) {
                            return false;
                        }
                        $modalInstance.close(filename);
                    };
                }]
            });

            modalInstance.result.then(function(filename) {
                var path = [];
                if (Session.currentPath) {
                    path.push(Session.currentPath);
                }
                path.push(filename);
                var relpath = path.join('/');
                Session.form.setFilename(relpath);
                that.save().then(function() {
                    Session.setFilename(relpath);
                });
            });

        };

        this.moveFile = function() {
            var modalInstance = $modal.open({
                templateUrl: 'file-move.html',
                controller: function($scope, $modalInstance) {

                    $scope.folder = '';
                    $scope.filename = '';

                    $scope.open = function(path) {
                        Session.currentPath = path;

                        $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);

                        Files.query(path).then(function(files) {
                            $scope.files = files;
                        });
                    };

                    $scope.open(Session.currentPath);

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        $modalInstance.close({'directory': Session.currentPath});
                    };
                }
            });

            modalInstance.result.then(function(data) {
                var files = Session.filesSelected;
                Files.move(files, data.directory);
            });
        };

        this.openNewWindow = function() {
            var files = Session.filesSelected, url;
            var id = +new Date();
            for(var i=0,len=files.length; i < len; i++) {
                url = files[i].editUrl;
                window.open('#' + url, id + '-' + i);
            }
            Session.unSelectFiles();
        };

        this.deleteFiles = function() {
            var files = Session.filesSelected;
            Files.delete(files);
        };

    }]);
