'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('waxeApp')
    .directive('navbar', function ($location, $modal, $http, NavbarService, UserProfile, AccountProfile, AuthService, MessageService, XmlUtils, Utils, UrlFactory, Session, $routeParams) {
        return {
            templateUrl: 'views/navbar.html',
            restrict: 'E',
            transclude: true,
            replace: true,
            link: function postLink(scope) {
                scope.NavbarService = NavbarService;
                scope.UserProfile = UserProfile;
                scope.AccountProfile = AccountProfile;
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
                scope.dtd_url = null;
                scope.dtd_tag =  null;
                scope.newXmlModal = function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'navbar-new.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.dtd_url = parentScope.dtd_url || AccountProfile.dtd_urls[0];
                            $scope.updateDtdTags = function(defaultTag) {
                                $scope.dtdTags = [];
                                XmlUtils.getDtdTags($scope.dtd_url).then(function(tags) {
                                    $scope.dtdTags = tags;
                                    $scope.dtd_tag = defaultTag || $scope.dtdTags[0];
                                });
                            };
                            $scope.updateDtdTags(parentScope.dtd_tag);

                            $scope.ok = function () {
                                $modalInstance.close({'dtd_url': $scope.dtd_url, 'dtd_tag': $scope.dtd_tag});
                                parentScope.dtd_url = $scope.dtd_url;
                                parentScope.dtd_tag = $scope.dtd_tag;
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

                scope.currentXmlTemplatePath = null;
                scope.newXmlTemplateModal = function() {
                    $modal.open({
                        templateUrl: 'navbar-open.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.url = 'xml/new';

                            $scope.open = function(path) {
                                parentScope.currentXmlTemplatePath = path;
                                $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path, AccountProfile.templates_path);
                                var url = UrlFactory.getUserAPIUrl('explore');
                                $http
                                  .get(url, {params: {path: path}})
                                  .then(function(res) {
                                    $scope.files = res.data;
                                });
                            };

                            $scope.open(parentScope.currentXmlTemplatePath || AccountProfile.templates_path);

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
                };

                scope.currentPath = null;
                scope.openModal = function() {
                    $modal.open({
                        templateUrl: 'navbar-open.html',
                        controller: function($scope, $modalInstance, parentScope) {

                            $scope.url = 'xml/edit';

                            $scope.open = function(path) {
                                parentScope.currentPath = path;
                                $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);
                                var url = UrlFactory.getUserAPIUrl('explore');
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
                };

                scope.save = function() {
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
                                var relpath = path.join('/');
                                Session.form.setFilename(relpath);
                                $scope.save().then(function() {
                                    Session.setBreadcrumbFiles(relpath);
                                });
                            };

                            $scope.open = function(path) {
                                parentScope.currentPath = path;

                                $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);

                                var url = UrlFactory.getUserAPIUrl('explore');
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

                scope.sourceToggle = function() {
                    var source = $routeParams.source;
                    var type = UrlFactory.getTypeFromUrl($location.path());
                    if (typeof source === 'undefined') {
                        if (type !== 'txt') {
                            var action = UrlFactory.getActionFromUrl($location.path());
                            var redirect = UrlFactory.userUrl('txt/'+action);
                            var params = {
                                path: $routeParams.path,
                                source: $location.path(),
                            };
                            $location.path(redirect).search(params);
                        }
                    }
                    else {
                        $location.path(source).search({path: $routeParams.path});
                    }
                };
            }
        };
    });
