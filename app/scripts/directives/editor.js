'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:editor
 * @description
 * # editor
 */
angular.module('waxeApp')
    .directive('editor', ['Session', '$interval', function (Session, $interval) {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element) {
                var listener = scope.$watch(function(){
                    if(element.text()) {
                        // Remove the watch since the form is fully loaded
                        listener();
                        waxe.form = new waxe.Form(scope.treeData);
                        Session.form = waxe.form;
                    }
                });

                var inter = $interval(function() {
                    if (Session.form && Session.form.filename && Session.form.status === 'updated'){
                        // TODO: is it really working
                        scope.save();
                    }
                }, 1000 * 60);

                scope.$on('$destroy', function() {
                    if (Session.form && Session.form.status) {
                        // TODO: use a modal
                        var res = window.confirm('Do you want to save the file before moving?');
                        if (res) {
                            scope.save();
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
