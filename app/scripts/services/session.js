'use strict';

/**
 * @ngdoc service
 * @name waxeangularApp.Session
 * @description
 * # Session
 * Factory in the waxeangularApp.
 */
angular.module('waxeApp')
    .service('Session', function (Utils) {

        // Will be updated when editing a form
        this.form = null;

        this.init = function() {
            this.currentFile = null;
            this.user = null;
            this.breadcrumbFiles = [];
        };

        this.init();

        this.updateFromRouteParams = function(routeParams) {
            this.form = false;
            this.user = routeParams.user;
            // TODO: handle correctly when routeParams is undefined
            this.setBreadcrumbFiles(routeParams.path);
        };

        this.update = function(response) {
            var params = response.config.params || {};
            this.user = params.user;
            this.setBreadcrumbFiles(params.path);
        };

        this.setBreadcrumbFiles = function(file) {
            if (file && this.currentFile === file) {
                // Nothing to do the breadcrumb is already generated
                return;
            }
            this.currentFile = file;
            this.breadcrumbFiles = Utils.getBreadcrumbFiles(this.currentFile);
        };
    });
