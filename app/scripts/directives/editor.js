'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:editor
 * @description
 * # editor
 */
angular.module('waxeApp')
    .directive('editor', ['$interval', 'Session', 'FileUtils', function ($interval, Session, FileUtils) {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                'html': '='
            },
            link: function postLink(scope, element) {
                element.append(scope.html);
                var listener = scope.$watch(function(){
                    if(element.text()) {
                        // Remove the watch since the form is fully loaded
                        listener();
                        waxe.form = new waxe.Form(scope.$parent.treeData);
                        Session.form = waxe.form;
                        angular.element(document).on('click', '.btn-external-editor', function() {
                            eval('scope.$parent.' + angular.element(this).attr('ng-click'));
                        });
                    }
                });

                Session.autosave_interval = $interval(function() {
                    if (Session.form && Session.form.filename && Session.form.status === 'updated'){
                        FileUtils.save();
                    }
                }, 1000 * 3);
            }
        };
    }]);
