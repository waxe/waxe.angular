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
    loadProfile: ['$route', '$interval', 'ProfileManager', 'Session', 'FileUtils', function($route, $interval, ProfileManager, Session, FileUtils) {
        // Make sure we save the file we are editing before changing route.
        if (Session.autosave_interval !== null) {
            $interval.cancel(Session.autosave_interval);
            Session.autosave_interval = null;
        }

        if (Session.form && Session.form.status) {
            // TODO: use a modal
            var res = window.confirm('Do you want to save the file before moving?');
            if (res) {
                FileUtils.save();
            }
        }
        Session.form = null;
        return ProfileManager.load($route.current.params.user);
    }]
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
        'ui.bootstrap',
        'ui.codemirror',
        'diff-match-patch'
    ])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
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
          .when('/account/:user/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl',
                resolve: resolve,
                reloadOnSearch: false
            })
          .when('/account/:user/versioning', {
                templateUrl: 'views/versioning.html',
                controller: 'VersioningCtrl',
                resolve: resolve,
            })
          .when('/account/:user/versioning/update', {
                templateUrl: 'views/versioningupdate.html',
                controller: 'VersioningUpdateCtrl',
                resolve: resolve,
            })
          .when('/account/:user/versioning/diff', {
                templateUrl: 'views/versioningdiff.html',
                controller: 'VersioningDiffCtrl',
                resolve: resolve
            })
          .when('/account/:user/versioning/unified-diff', {
                templateUrl: 'views/versioningunifieddiff.html',
                controller: 'VersioningUnifiedDiffCtrl',
                resolve: resolve,
                diff: true
            })
          .when('/account/:user/txt/edit', {
                templateUrl: 'views/edittxt.html',
                controller: 'EditTxtCtrl',
                resolve: resolve,
                editor: true,
                type: 'txt',
                action: 'edit'

            })
          .when('/account/:user/:type/edit', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl',
                resolve: resolve,
                editor: true,
                type: 'xml',
                action: 'edit'
            })
          .when('/account/:user/:type/new', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl',
                resolve: resolve,
                noAutoBreadcrumb: true,
                type: 'xml',
                action: 'new'
            })
          .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('HttpInterceptor');
    }])
    .run(['$rootScope', 'Session', 'MessageService', function($rootScope, Session, MessageService) {

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (angular.isDefined(current)) {
                if (!angular.isDefined(current.$$route.editor) || current.$$route.editor !== next.$$route.editor) {
                    // Do not close message when we are switching from an
                    // editor to an other. It's usefull to keep error message
                    // when for example a file is invalid and we redirect to
                    // the txt editor
                    MessageService.close();
                }
            }
            MessageService.setIfEmpty('loading', 'Loading...', 'info');

        });

        $rootScope.$on('$routeChangeSuccess', function() {
            MessageService.close('loading');
        });

        $rootScope.$on('$routeChangeError', function() {
            MessageService.close('loading');
        });

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

    }]);
