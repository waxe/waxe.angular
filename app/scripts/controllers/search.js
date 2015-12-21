'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('SearchCtrl', ['$scope', '$http', '$routeParams', '$location', '$anchorScroll', '$modal', 'UrlFactory', 'Utils', 'XmlUtils', 'AccountProfile', 'Files', 'File', function ($scope, $http, $routeParams, $location, $anchorScroll, $modal, UrlFactory, Utils, XmlUtils, AccountProfile, Files, File) {

        $scope.UrlFactory = UrlFactory;
        // TODO: we should have a list somewhere with the supported extension
        $scope.filetypes = [
            {text: 'Select a filetype (optional)',
             value: ''},
            {text: 'xml',
            value: '.xml'}
        ];
        $scope.search = {
            search: $routeParams.search,
            page: $routeParams.page,
            path: $routeParams.path,
            tag: $routeParams.tag,
            // Since only XML is support for now, put it as default
            filetype: '.xml', // $scope.filetypes[0].value
            open: $routeParams.open
        };
        $scope.totalItems = 0;
        $scope.itemsPerPage = 0;
        $scope.maxSize = 10;
        $scope.results = [];


        $scope.doSearch = function() {
            $location.search($scope.search);
            var url = UrlFactory.jsonAPIUserUrl('search/search');
            $http
              .get(url, {params: $scope.search})
              .then(function(res) {
                $anchorScroll();
                var files = Files.dataToObjs(res.data.results);
                if($scope.search.open) {
                    if (res.data.nb_items === 1) {
                        $location.url(files[0].editUrl);
                        return;
                    }
                }
                $scope.results = files;
                $scope.totalItems = res.data.nb_items;
                $scope.itemsPerPage = res.data.items_per_page;
                $scope.$emit('pageLoaded');
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
                        var url = UrlFactory.jsonAPIUserUrl('explore');
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

        // TODO: refactor this logic we have the same in directive/navbar.js
        // Also refactor the templates
        $scope.dtd_tag = null;
        $scope.tagModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'tag-modal.html',
                controller: function($scope, $modalInstance, parentScope) {

                    $scope.dtd_url = parentScope.dtd_url || AccountProfile.dtd_urls[0];
                    $scope.updateDtdTags = function(defaultTag) {
                        $scope.dtdTags = [];
                        XmlUtils.getDtdTags($scope.dtd_url, true).then(function(tags) {
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
                        return $scope;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                $scope.search.tag = data.dtd_tag;
            });

        };
    }]);
