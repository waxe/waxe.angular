'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Message
 * @description
 * # Message
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('MessageService', function () {
        this.message = null;
        this.type = null;

        this.set = function(type, message) {
            this.type = type;
            this.message = message;
        };

        this.close = function() {
            this.message = null;
        };
    });
