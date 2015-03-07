'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Apiurl
 * @description
 * # Apiurl
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('APIUrl', function () {
        this.getUrl = function(key) {
            return '/api/1/' + key + '.json';
        };
    });
