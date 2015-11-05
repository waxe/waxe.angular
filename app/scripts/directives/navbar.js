'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('waxeApp')
    .directive('navbar', ['$location', '$modal', '$http', 'NavbarService', 'UserProfile', 'AccountProfile', 'AuthService', 'MessageService', 'XmlUtils', 'Utils', 'FileUtils', 'UrlFactory', 'Session', '$routeParams', '$route', function ($location, $modal, $http, NavbarService, UserProfile, AccountProfile, AuthService, MessageService, XmlUtils, Utils, FileUtils, UrlFactory, Session, $routeParams, $route) {
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
                scope.FileUtils = FileUtils;
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

                scope.doRender = function() {
                    // TODO: the url should not be in JSON.
                    var url = UrlFactory.jsonAPIUserUrl('xml/view') + '?path=' + Session.filename;
                    window.open(url, '_viewer');
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
                        var previousUrl = $location.$$absUrl;
                        var url = UrlFactory.userUrl('xml/new');
                        $location.path(url).search(data);
                        if (previousUrl === $location.$$absUrl) {
                            // The location didn't change but we want to force
                            // the reload
                            $route.reload();
                        }
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
                                var url = UrlFactory.jsonAPIUserUrl('explore');
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

                Session.currentPath = null;
                scope.openModal = function() {
                    $modal.open({
                        templateUrl: 'navbar-open.html',
                        controller: function($scope, $modalInstance) {

                            $scope.url = 'xml/edit';

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
                };

                scope.sourceToggle = function() {
                    var from = $routeParams.from;
                    var type = $route.current.$$route.type;
                    if (typeof from === 'undefined' || $routeParams.fromtype !== 'source') {
                        if (type !== 'txt') {
                            var redirect = UrlFactory.userUrl('txt/edit');
                            var params = {
                                path: $routeParams.path,
                                from: from || $location.path(),
                                fromtype: 'source'
                            };
                            $location.path(redirect).search(params);
                        }
                    }
                    else {
                        $location.path(from).search({path: $routeParams.path});
                    }
                };

                scope.diffToggle = function() {
                    var from = $routeParams.from;
                    if (typeof from === 'undefined' || $routeParams.fromtype !== 'diff') {
                        var redirect = UrlFactory.userUrl('versioning/unified-diff');
                        var params = {
                            path: $routeParams.path,
                            from: from || $location.path(),
                            fromtype: 'diff'
                        };
                        $location.path(redirect).search(params);
                    }
                    else {
                        $location.path(from).search({path: $routeParams.path});
                    }
                };

                scope.showDiff = function() {
                    var redirect = UrlFactory.userUrl('versioning/unified-diff');
                    var params = {
                        path: $routeParams.path,
                    };
                    $location.path(redirect).search(params);
                };
            }
        };
    }])
.directive('menuItem', ['$compile', '$templateRequest', '$sce', '$animate', '$parse', '$location', 'NavbarService', 'FileUtils', 'UrlFactory', 'UserProfile', 'AccountProfile', 'Session', function ($compile, $templateRequest, $sce, $animate, $parse, $location, NavbarService, FileUtils, UrlFactory, UserProfile, AccountProfile, Session) {
    return {
        restrict: 'E',
        scope: {
            obj: '=',
            sub: '@',
            icon: '='
        },
        link: function link(scope, $element) {
            scope.NavbarService = NavbarService;
            //
            // NOTE: We need to attach some services to the scope to be able to
            // parse the action.
            scope.FileUtils = FileUtils;
            scope.UrlFactory = UrlFactory;
            scope.AccountProfile = AccountProfile;
            scope.Session = Session;
            scope.UserProfile = UserProfile;

            var key, children;
            if (typeof scope.obj === 'string') {
                key = scope.obj;
                children = [];
            }
            else {
                key = Object.keys(scope.obj)[0];
                children = scope.obj[key];
            }

            scope.clickItem = function() {
                var item = NavbarService[key];
                if (item.enable === false) {
                    return false;
                }
                if (item.href) {
                    var url = $parse(item.href)(scope);
                    return $location.path(url);
                }
                $parse(item.action)(scope)();
            };

            if (key === '-') {
                $element.replaceWith('<li class="divider"></li>');
                return;
            }

            var item = NavbarService[key];

            if (item.template) {
                scope.item = item;
                $compile(item.template)(scope, function(newElement) {
                    $element.replaceWith(newElement);
                });
            }
            else if (item.templateUrl) {
                $templateRequest(item.templateUrl).then(function(tplContent) {
                    scope.item = item;
                    $compile(tplContent.trim())(scope, function(newElement) {
                        $element.replaceWith(newElement);
                    });
                });
            }
            else if (children.length) {
                // Create a dropdown
                var template;
                if(scope.sub) {
                    template = 'navbar-item-group.html';
                }
                else {
                    template = 'navbar-item-dropdown.html';
                }
                $templateRequest(template).then(function(tplContent) {
                    scope.item = item;
                    scope.children = children;
                    $compile(tplContent.trim())(scope, function(newElement) {
                        $element.replaceWith(newElement);
                    });
                });
            }
            else {
                $templateRequest('navbar-item.html').then(function(tplContent) {
                    scope.item = item;
                    $compile(tplContent.trim())(scope, function(newElement) {
                        $element.replaceWith(newElement);
                    });
                });
            }
        }
    };
}]);
