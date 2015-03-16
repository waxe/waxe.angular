'use strict';

/**
 * @ngdoc service
 * @name waxeApp.HttpInterceptor
 * @description
 * # HttpInterceptor
 * Factory in the waxeApp.
 */
angular.module('waxeApp')
    .factory('HttpInterceptor', function ($location, $q) {

        return {
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/login');
                }
                // TODO: Put the error message in Message
                return $q.reject(rejection);
            }
        };
    });
