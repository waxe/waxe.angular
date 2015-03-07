'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Userprofile
 * @description
 * # Userprofile
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('UserProfile', function () {
        this.create = function (data) {
            for (var k in data) {
                this[k] = data[k];
            }
        };
        this.destroy = function () {
            this.login = null;
            // TODO: clean correctly this
        };
    });
