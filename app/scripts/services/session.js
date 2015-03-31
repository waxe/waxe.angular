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
            this.submitForm = null;
            this.hasForm = null;
        };

        this.init();

        this.updateFromRouteParams = function(routeParams) {
            // TODO: review the logic. We should call the init here to be sure
            // all the attributes are well reset
            this.form = null;
            this.hasForm = null;
            this.submitForm = null;
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
            // TODO: we have a problem when this.currentFile is a list.
            // Perhaps we should chec this.currentFile is string to dislay it.
            // It's the case when making a diff of many files.
            this.breadcrumbFiles = Utils.getBreadcrumbFiles(this.currentFile);
        };
    });
