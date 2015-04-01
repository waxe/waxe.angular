'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('waxeApp')
    .directive('navbar', function ($location, $modal, $http, NavbarService, UserProfile, AuthService, MessageService, XmlUtils, Utils, UrlFactory, Session) {
        return {
            templateUrl: 'views/navbar.html',
            restrict: 'E',
            transclude: true,
            replace: true,
            link: function postLink(scope) {
                scope.NavbarService = NavbarService;
                scope.UserProfile = UserProfile;
                scope.UrlFactory = UrlFactory;
                scope.Session = Session;
                scope.logout = function() {
                    AuthService.logout().then(function() {
                        $location.path('/login');
                    }, function(res) {
                        MessageService.set('danger', res.data);
                    });
                };

                // We need to have an object to make ng-model working
                scope.search = {text: ''};
                scope.doSearch = function() {
                    $location.url(UrlFactory.userUrl('search')).search({search: scope.search.text});
                    scope.search.text = '';
                };

                // We need this variable to keep the last selected choice
                scope.dtdUrl = null;
                scope.dtdTag =  null;
                scope.newXmlModal = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'navbar-new.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.dtdUrl = parentScope.dtdUrl || UserProfile.dtd_urls[0];
                            $scope.updateDtdTags = function(defaultTag) {
                                $scope.dtdTags = [];
                                XmlUtils.getDtdTags($scope.dtdUrl).then(function(tags) {
                                    $scope.dtdTags = tags;
                                    $scope.dtdTag = defaultTag || $scope.dtdTags[0];
                                });
                            };
                            $scope.updateDtdTags(parentScope.dtdTag);

                            $scope.ok = function () {
                                $modalInstance.close({'dtdUrl': $scope.dtdUrl, 'dtdTag': $scope.dtdTag});
                                parentScope.dtdUrl = $scope.dtdUrl;
                                parentScope.dtdTag = $scope.dtdTag;
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            parentScope: function() {
                                return scope;
                            }
                        }
                    });

                    modalInstance.result.then(function(data) {
                        var url = UrlFactory.userUrl('xml/new');
                        $location.path(url).search(data);
                    });

                };

                scope.currentPath = null;
                scope.openModal = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'navbar-open.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.open = function(path) {
                                parentScope.currentPath = path;
                                $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);
                                var url = UrlFactory.getUserAPIUrl('ng-explore');
                                $http
                                  .get(url, {params: {path: path}})
                                  .then(function(res) {
                                    $scope.files = res.data;
                                });
                            };

                            $scope.open(parentScope.currentPath);

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            parentScope: function() {
                                return scope;
                            }
                        }
                    });

                    modalInstance.result.then(function(data) {
                        var url = UrlFactory.userUrl('xml/new');
                        $location.path(url).search(data);
                    });

                };

                scope.save = function() {
                    console.log('save');
                    var dic;
                    // TODO: if we keep this logic we should refactor this function.
                    if (Session.submitForm) {
                        Session.submitForm();
                        return;
                    }
                    // TODO: move this logic in edit controller
                    if (!Session.form.filename) {
                        scope.saveasModal();
                        return;
                    }
                    dic = Utils.getFormDataForSubmit(Session.form.$element);
                    $http
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

                scope.saveasModal = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'navbar-saveas.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.folder = '';
                            $scope.filename = '';

                            $scope.createFolder = function() {
                                var url = UrlFactory.getUserAPIUrl('create-folder');
                                $http
                                  .post(url, {path: parentScope.currentPath,
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
                                if (parentScope.currentPath) {
                                    path.push(parentScope.currentPath);
                                }
                                path.push(filename);
                                Session.form.setFilename(path.join('/'));
                                $scope.save();
                            };

                            $scope.open = function(path) {
                                parentScope.currentPath = path;

                                $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);

                                var url = UrlFactory.getUserAPIUrl('ng-explore');
                                $http
                                  .get(url, {params: {path: path}})
                                  .then(function(res) {
                                    $scope.files = res.data;
                                });
                            };

                            $scope.open(parentScope.currentPath);

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            parentScope: function() {
                                return scope;
                            }
                        }
                    });

                    modalInstance.result.then(function(data) {
                        var url = UrlFactory.userUrl('xml/new');
                        $location.path(url).search(data);
                    });

                };
            }
        };
    });
