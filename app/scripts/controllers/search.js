'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('SearchCtrl', ['$scope', '$http', '$routeParams', '$location', '$anchorScroll', '$modal', 'UrlFactory', 'Utils', function ($scope, $http, $routeParams, $location, $anchorScroll, $modal, UrlFactory, Utils) {

        $scope.UrlFactory = UrlFactory;
        $scope.search = {
            search: $routeParams.search,
            page: $routeParams.page,
            path: ''
        };
        $scope.totalItems = 0;
        $scope.itemsPerPage = 0;
        $scope.maxSize = 10;
        $scope.results = [];

        $scope.doSearch = function() {
            $location.search($scope.search);
            var url = UrlFactory.getUserAPIUrl('search');
            $http
              .get(url, {params: $scope.search})
              .then(function(res) {
                $anchorScroll();
                $scope.results = res.data.results;
                $scope.totalItems = res.data.nb_items;
                $scope.itemsPerPage = res.data.items_per_page;
            });
        };

        $scope.newSearch = function() {
            $scope.search.page = 1;
            $scope.doSearch();

        };

        $scope.pageChanged = function() {
            $scope.doSearch();
        };

        if(angular.isDefined($scope.search.search)) {
            $scope.doSearch();
        }

        $scope.currentPath = null;
        $scope.folderModal = function() {
            $modal.open({
                templateUrl: 'search-folder.html',
                controller: function($scope, $modalInstance, parentScope) {

                    $scope.selectFolder = function(path) {
                        parentScope.currentPath = path;
                        $scope.breadcrumbFiles = Utils.getBreadcrumbFiles(path);
                        var url = UrlFactory.getUserAPIUrl('explore');
                        $http
                          .get(url, {params: {path: path}})
                          .then(function(res) {
                            $scope.files = res.data;
                        });
                    };

                    $scope.selectFolder(parentScope.currentPath);

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.select = function () {
                        parentScope.search.path = parentScope.currentPath;
                        $modalInstance.close();
                    };
                },
                resolve: {
                    parentScope: function() {
                        return $scope;
                    }
                }
            });

        };
    }]);
