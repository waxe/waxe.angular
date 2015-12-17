'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('MainCtrl', ['$scope', '$location', 'UrlFactory', 'UserProfile', 'Session', 'File', function ($scope, $location, UrlFactory, UserProfile, Session, File) {
        var qs = $location.search(),
            hash = $location.hash();

        if (UserProfile.has_file === true) {
            // The user has some file to edit, just redirect it.
            var url = UrlFactory.userUrl('', qs, hash);
            $location.url(url);
            return;
        }

        $scope.Session = Session;
        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile= UserProfile;
        $scope.qs = qs;
        $scope.hash = hash;
        $scope.$emit('pageLoaded');
    }]);
