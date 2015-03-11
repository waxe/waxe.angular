'use strict';

/**
 * @ngdoc service
 * @name waxeApp.HttpInterceptor
 * @description
 * # HttpInterceptor
 * Factory in the waxeApp.
 */
angular.module('waxeApp')
    .factory('HttpInterceptor', function ($location, $q, Session) {

        return {
            response: function(response) {
                // Put the params in the Session
                Session.update(response);
                return response;
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        };
    });
