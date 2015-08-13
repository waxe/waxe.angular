'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningdiffCtrl
 * @description
 * # VersioningdiffCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningDiffCtrl', ['$scope', '$http', '$routeParams', '$modal', '$compile', 'UrlFactory', 'Session', 'Utils', 'MessageService', function ($scope, $http, $routeParams, $modal, $compile, UrlFactory, Session, Utils, MessageService) {

        var url = UrlFactory.jsonAPIUserUrl('versioning/full-diff');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
                $scope.diffs = res.data.diffs;
                $scope.diffOptions = {
                    attrs: {
                        insert: {
                            contenteditable: true
                        },
                        equal: {
                            contenteditable: true
                        }
                    }
                };
                $scope.can_commit = res.data.can_commit;
                Session.submitForm = $scope.submitForm;
                Session.hasForm = true;
                $scope.$emit('pageLoaded');
            });

        $scope.submitForm = function(commit) {
            angular.element('.diff').each(function() {
                var $diff = angular.element(this);
                var html = '';
                $diff.contents().each(function(){
                    var $this = angular.element(this);
                    if (! $this.is('del')) {
                        html += $this.text();
                    }
                });
                $diff.prev('textarea').val(html);
            });
            var $form = angular.element('.diff-form'),
                dic = Utils.getFormDataForSubmit($form),
                url = UrlFactory.jsonAPIUserUrl('txt/updates');

            $http
                .post(url, dic.data)
                .then(function(res) {
                    MessageService.set('success', res.data);
                });

            if (commit === true && typeof dic.data !== 'undefined') {
                var filenames = [];
                for (var k in dic.data) {
                    if (k.match(/:filename$/)) {
                        filenames.push(dic.data[k]);
                    }
                }
                // TODO: refactor this with versioning.js, it's a copy/paste of
                // the code
                var modalInstance = $modal.open({
                    templateUrl: 'commit.html',
                    controller: function($scope, $modalInstance) {

                        $scope.ok = function () {
                            $modalInstance.close({'message': $scope.message});
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });

                modalInstance.result.then(function(data) {
                    var url = UrlFactory.jsonAPIUserUrl('versioning/commit');
                    $http
                        .post(url, {paths: filenames, msg: data.message})
                        .then(function(res) {
                            MessageService.set('success', res.data);
                        });
                });
            }
            return;
        };
    }]);
