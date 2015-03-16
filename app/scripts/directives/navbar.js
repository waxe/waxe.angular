'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:navbar
 * @description
 * # navbar
 */
angular.module('waxeApp')
    .directive('navbar', function ($location, $modal, NavbarService, UserProfile, AuthService, MessageService, Utils, UrlFactory) {
        return {
            templateUrl: 'views/navbar.html',
            restrict: 'E',
            transclude: true,
            link: function postLink(scope) {
                scope.NavbarService = NavbarService;
                scope.UserProfile = UserProfile;
                scope.UrlFactory = UrlFactory;
                scope.logout = function() {
                    AuthService.logout().then(function() {
                        $location.path('/login');
                    }, function(res) {
                        MessageService.set('danger', res.data);
                    });
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
                                Utils.getDtdTags($scope.dtdUrl).then(function(tags) {
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
            }
        };
    });
