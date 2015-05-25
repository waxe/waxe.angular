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

        this.set = function(type, message, classname) {
            if (this.timer) {
                // Stop the timer
                $timeout.cancel(this.timer);
            }
            this.type = type;
            this.message = message;
            this.classname = angular.isDefined(classname)? classname: this.type;

            if (this.type === 'success') {
                var that = this;
                this.timer = $timeout(function () {
                    that.close();
                }, 500);
            }
        };

        this.setIfEmpty = function(type, message, classname) {
            if (this.message) {
                return false;
            }
            this.set(type, message, classname);
        };

        this.close = function(type) {
            if (angular.isDefined(type) && type !== this.type ){
                return false;
            }
            this.message = null;
        };
    }]);
