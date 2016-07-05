'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditTxtCtrl
 * @description
 * # EditTxtCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('NewTxtCtrl',['$scope', '$http', '$sce', '$routeParams', '$route', '$location', '$modal', 'UrlFactory', 'Session', 'MessageService', 'NavbarService', 'FileUtils', function ($scope, $http, $sce, $routeParams, $route, $location, $modal, UrlFactory, Session, MessageService, NavbarService, FileUtils) {

        var that = this;
        $scope.editorOptions = {
                lineWrapping : true,
                lineNumbers: true,
                // TODO: choose the mode according to the file
                mode: 'xml',
            };

        Session.submitForm = function() {

            if (!angular.isDefined(Session.filename) || !Session.filename) {
                that.saveasModal();
                return;
            }
            var url = UrlFactory.jsonAPIUserUrl('txt/update');
            var params = {path: Session.filename, filecontent: $scope.txt};
            var conflicted = $location.search().conflicted;
            if (angular.isDefined(conflicted)) {
                params.conflicted = conflicted;
            }
            $http
                .post(url, params)
                .then(function() {
                    Session.setBreadcrumbFiles(Session.filename);
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
                Session.filename = relpath;
                Session.submitForm();
            });

        };


        if ($routeParams.path) {
            var url = UrlFactory.jsonAPIUserUrl('txt/' + 'new');
            $http
                .get(url, {params: $routeParams})
                .then(function(res) {
                    $scope.txt = res.data;
                    NavbarService.setEditFile(true, false);
                    $scope.$emit('pageLoaded');
                });
        }
        else {
            NavbarService.setEditFile(true, false);
            $scope.$emit('pageLoaded');
        }
    }]);
