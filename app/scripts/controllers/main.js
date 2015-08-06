'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('MainCtrl', ['$scope', '$location', 'UrlFactory', 'UserProfile', 'Session', function ($scope, $location, UrlFactory, UserProfile, Session) {

        var path = $location.search().path;

        if (UserProfile.has_file === true) {
            var url;
            if (angular.isDefined(path)) {
                // TODO: remove this hardcoded path when we will be able to edit more filetype
                url = UrlFactory.userUrl('xml/edit', {path: path});
            }
            else {
                url = UrlFactory.userUrl();
            }
            $location.url(url);
            return;
        }

        $scope.Session = Session;
        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile= UserProfile;
        $scope.path = path;
    }]);
