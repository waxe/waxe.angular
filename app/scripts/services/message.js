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

        this.set = function(type, message) {
            if (this.timer) {
                // Stop the timer
                $timeout.cancel(this.timer);
            }
            this.type = type;
            this.message = message;

            if (this.type === 'success') {
                var that = this;
                this.timer = $timeout(function () {
                    that.close();
                }, 500);
            }
        };

        this.close = function() {
            this.message = null;
        };
    }]);
