'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:message
 * @description
 * # message
 */
angular.module('waxeApp')
    .directive('message', function (MessageService) {
        return {
            template: '<div class="alert-message alert alert-{{MessageService.type}}" ng-class="MessageService.animation" ng-if="MessageService.message">{{MessageService.message}}<button type="button" class="close" ng-click="MessageService.close()">x</button></div>',
            restrict: 'E',
            link: function postLink(scope) {
                scope.MessageService = MessageService;
            }
        };
    });
