'use strict';

/**
 * @ngdoc service
 * @name waxeApp.HttpInterceptor
 * @description
 * # HttpInterceptor
 * Factory in the waxeApp.
 */
angular.module('waxeApp')
    .factory('HttpInterceptor', ['$location', '$q', 'MessageService', function ($location, $q, MessageService) {

        return {
            responseError: function(rejection) {

                if (rejection.status === 401) {
                    if ($location.$$path !== '/login') {
                        $location.url('/login?next=' + encodeURIComponent($location.url()));
                        return $q.reject(rejection);
                    }
                }

                MessageService.set('danger', rejection.data);
                return $q.reject(rejection);
            }
        };
    }]);
