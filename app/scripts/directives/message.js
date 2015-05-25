'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:message
 * @description
 * # message
 */
angular.module('waxeApp')
    .directive('message', ['MessageService', function (MessageService) {
        return {
            template: '<div class="alert-message alert alert-{{MessageService.classname}}" ng-class="MessageService.animation" ng-if="MessageService.message">{{MessageService.message}}<button type="button" class="close" ng-click="MessageService.close()">x</button></div>',
            restrict: 'E',
            link: function postLink(scope, element) {
                scope.MessageService = MessageService;
                scope.$watch(function(){
                    if (scope.MessageService.message) {
                        var $elt = element.children().eq(0);
                        var left = ($('body').width() - $elt.outerWidth()) / 2;
                        $elt.css({left: left + 'px'});
                    }

                });
            }
        };
    }]);
