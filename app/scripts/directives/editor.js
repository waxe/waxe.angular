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

                var inter = $interval(function() {
                    if (Session.form && Session.form.filename && Session.form.status === 'updated'){
                        FileUtils.save();
                    }
                }, 1000 * 30);

                scope.$on('$destroy', function() {
                    if (Session.form && Session.form.status) {
                        // TODO: use a modal
                        var res = window.confirm('Do you want to save the file before moving?');
                        if (res) {
                            FileUtils.save();
                        }
                    }

                    Session.form = null;
                    if (angular.isDefined(inter)) {
                        $interval.cancel(inter);
                    }
                });
            }
        };
    }]);
