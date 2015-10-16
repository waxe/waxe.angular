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

        // Support path and search shortcut
        var path = $location.search().path;
        var search = $location.search().search;

        if (UserProfile.has_file === true) {
            var url;
            if (angular.isDefined(path)) {
                // TODO: remove this hardcoded path when we will be able to edit more filetype
                url = UrlFactory.userUrl('xml/edit', {path: path});
            }
            else if (angular.isDefined(search)){
                url = UrlFactory.userUrl('search', $location.search());
            }
            else {
                url = UrlFactory.userUrl();
            }
            $location.url(url);
            return;
        }

        $scope.$emit('pageLoaded');
        $scope.Session = Session;
        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile= UserProfile;
        $scope.path = path;
        $scope.search = search;
        $scope.qs = $location.search();
    }]);
