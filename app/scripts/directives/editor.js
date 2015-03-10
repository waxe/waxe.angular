'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:editor
 * @description
 * # editor
 */
angular.module('waxeApp')
    .directive('editor', function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                scope.$watch(function(){
                    if(element.text()) {
                        waxe.form = new waxe.Form(scope.treeData);
                    }
                });
            }
        };
    });
