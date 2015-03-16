'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('MainCtrl', function ($scope, $location, UrlFactory, UserProfile, Session) {

        Session.init();

        if(UserProfile.root_path !== null) {
            Session.user = UserProfile.login;
        }

        if (Session.user !== null) {
            $location.url(UrlFactory.userUrl());
            return;
        }

        $scope.Session = Session;
        $scope.UrlFactory = UrlFactory;
        $scope.UserProfile= UserProfile;
    });
