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
                .get(UrlFactory.jsonAPIUserUrl('xml/get-tags'), {params: {dtd_url: url}})
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
                // NOTE: serializeArray add some CR, we remove them to keep
                // unix format.
                data[d.name] = d.value.replace(/\r/g, '');
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

    }).service('FileUtils', ['$http', '$location', '$modal', 'Session', 'MessageService', 'UrlFactory', 'Utils', function ($http, $location, $modal, Session, MessageService, UrlFactory, Utils) {
        var that = this;
        this.save = function() {
            var dic;
            // TODO: if we keep this logic we should refactor this function.
            if (Session.submitForm) {
                Session.submitForm();
                return;
            }

            if (!Session.form.filename) {
                this.saveasModal();
                return;
            }
            dic = Utils.getFormDataForSubmit(Session.form.$element);
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
                controller: function($scope, $modalInstance) {

                    $scope.folder = '';
                    $scope.filename = '';

                    $scope.createFolder = function() {
                        var url = UrlFactory.jsonAPIUserUrl('create-folder');
                        $http
                          .post(url, {path: Session.currentPath,
                                              name: $scope.folder})
                          .then(function(res) {
                            $scope.open(res.data.link);
                            $scope.folder = '';
                        });
                    };

                    $scope.saveAs = function(filename) {
                        filename = filename || $scope.filename;
                        if (! filename) {
                            return;
                        }
                        $scope.cancel();
                        var path = [];
                        if (Session.currentPath) {
                            path.push(Session.currentPath);
                        }
                        path.push(filename);
                        var relpath = path.join('/');
                        Session.form.setFilename(relpath);
                        that.save().then(function() {
                            Session.setBreadcrumbFiles(relpath);
                        });
                    };

                    $scope.open = function(path) {
                        Session.currentPath = path;

                        $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);

                        var url = UrlFactory.jsonAPIUserUrl('explore');
                        $http
                          .get(url, {params: {path: path}})
                          .then(function(res) {
                            $scope.files = res.data;
                        });
                    };

                    $scope.open(Session.currentPath);

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });

            modalInstance.result.then(function(data) {
                var url = UrlFactory.userUrl('xml/new');
                $location.path(url).search(data);
            });

        };
    }]);
