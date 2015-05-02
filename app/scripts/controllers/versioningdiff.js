'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:VersioningdiffCtrl
 * @description
 * # VersioningdiffCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('VersioningDiffCtrl', function ($scope, $http, $routeParams, $sce, $compile, UrlFactory, Session, Utils, MessageService) {

        var url = UrlFactory.getUserAPIUrl('versioning/full-diff');
        $http
          .get(url, {params: $routeParams})
          .then(function(res) {
                $scope.html = $compile(res.data.content)($scope);
                Session.submitForm = $scope.submitForm;
                Session.hasForm = true;
            });

        $scope.submitForm = function() {
            var $form = $scope.html.find('form');

            $form.find('table.diff').each(function(){
                $(this).prev('textarea').val('');
                var html = '';
                $(this).find('td.diff_to pre').each(function(){
                    $(this).contents().each(function(){
                        html += $(this).text();
                    });
                    html += '\n';
                });
                $(this).prev('textarea').val(html);
            });
            var dic = Utils.getFormDataForSubmit($form);
            $http
                .post(dic.url, dic.data)
                .then(function() {
                    MessageService.set('success', 'Saved!');
                });
            return;
        };
    });
