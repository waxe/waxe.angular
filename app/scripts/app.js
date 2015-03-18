'use strict';

/**
 * @ngdoc overview
 * @name waxeApp
 * @description
 * # waxeApp
 *
 * Main module of the application.
 */


// We want to be sure the profile is loaded before displaying a page.
// If the user is not logged he will be redirect to the login page since in
// this case the profile page returns a 401.
var resolve = {
    profileLoaded: function(AuthService) {
        return AuthService.profileLoaded();
    }
};

angular
    .module('waxeApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.layout',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
          .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: resolve
            })
          .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
          .when('/account/:user', {
                templateUrl: 'views/filemanager.html',
                controller: 'FileManagerCtrl',
                resolve: resolve
            })
          .when('/account/:user/:type/edit', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl',
                resolve: resolve
            })
          .when('/account/:user/:type/new', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl',
                resolve: resolve
            })
          .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('HttpInterceptor');
    })
    .run(function($rootScope, Session) {

        // Be sure the user save before closing window
        window.onbeforeunload = function(event) {
            if(Session.form && Session.form.status){

                event = event || window.event;
                var confirmClose = 'The file has been updated, are you sure you want to exit?';
                if (event) {
                    event.returnValue = confirmClose;
                }
                // For safari
                return confirmClose;
            }
        };

    });
