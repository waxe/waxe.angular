'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Message
 * @description
 * # Message
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('MessageService', ['$timeout', function ($timeout) {
        this.message = null;
        this.type = null;
        this.timer = null;

        this.set = function(type, message, classname, timeout) {
            if (this.timer) {
                // Stop the timer
                $timeout.cancel(this.timer);
            }
            this.type = type;
            this.message = message;
            this.classname = angular.isDefined(classname)? classname: this.type;

            var realtimeout = angular.isDefined(timeout)? timeout: 3000;
            if (this.type === 'success' || angular.isDefined(timeout)) {
                var that = this;
                this.timer = $timeout(function () {
                    that.close();
                }, realtimeout);
            }
        };

        this.setIfEmpty = function(type, message, classname, timeout) {
            if (this.message) {
                return false;
            }
            this.set(type, message, classname, timeout);
        };

        // TODO: perhaps setIfEmpty is enough and we can add this logic in.
        this.setIfEmptyOrSameType = function(type, message, classname, timeout) {
            if (this.message && type !== this.type) {
                return false;
            }
            this.set(type, message, classname, timeout);
        };

        this.close = function(type) {
            if (angular.isDefined(type) && type !== this.type ){
                return false;
            }
            this.message = null;
        };
    }]);
