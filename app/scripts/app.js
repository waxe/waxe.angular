'use strict';

/**
 * @ngdoc overview
 * @name waxeApp
 * @description
 * # waxeApp
 *
 * Main module of the application.
 */
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
                controller: 'MainCtrl'
            })
          .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
          .when('/account/:user', {
                templateUrl: 'views/filemanager.html',
                controller: 'FileManagerCtrl'
            })
          .when('/account/:user/:type/edit', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl'
            })
          .when('/account/:user/:type/new', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl'
            })
          .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('HttpInterceptor');
    })
    .run(['AuthService', function(AuthService) {
        AuthService.profile();
    }]);
