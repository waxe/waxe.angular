'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:UserAccount
 * @description
 * # UserAccount
 */
angular.module('waxeApp')
    .directive('useraccount', ['Session', 'UserProfile', function (Session, UserProfile) {
        return {
            template: '<div class="container alert-useraccount alert alert-warning" ng-if="Session.login != UserProfile.login">You are working on the account of <strong>{{Session.login}}</strong></div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope) {
                scope.Session = Session;
                scope.UserProfile = UserProfile;
            }
        };
    }]);
