'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:UserAccount
 * @description
 * # UserAccount
 */
angular.module('waxeApp')
    .directive('useraccount', ['$location', 'Session', 'UserProfile', 'File', function ($location, Session, UserProfile, File) {
        return {
            template: '<div class="container alert-useraccount alert alert-warning" ng-if="Session.login != UserProfile.login">You are working on the account of <strong>{{Session.login}}</strong>. <a ng-if="Session.filename" href="" ng-click="openUserFile()">Open this file in your account</a></div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope) {
                scope.Session = Session;
                scope.UserProfile = UserProfile;
                scope.openUserFile = function() {
                    var file = File.loadFromPath(Session.filename);
                    file.user = UserProfile.login;
                    $location.url(file.editUrl);
                };
            }
        };
    }]);
