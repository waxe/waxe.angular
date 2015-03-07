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
        'ngTouch'
    ])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
          .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
          .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
          .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
          .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('HttpInterceptor');
    })
    .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
        AuthService.profile();
    }]);
