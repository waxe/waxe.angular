'use strict';

/**
 * @ngdoc service
 * @name waxeangularApp.Session
 * @description
 * # Session
 * Factory in the waxeangularApp.
 */
angular.module('waxeApp')
    .service('Session', function ($http, $q, $route, Utils, UserProfile, AccountProfile) {

        this.init = function(login, accountUsable) {
            this.login = login;
            // Should be true when we can use the account data
            this.accountUsable = accountUsable;
            this.currentFile = null;
            this.user = null;
            this.breadcrumbFiles = [];

            // Special handler when we click on the save button
            this.submitForm = null;
            // We have a form, we should enable the save button
            this.hasForm = null;
            // XML form
            // NOTE: it enables the 'save as' button
            this.form = null;

            if (this.accountUsable) {
                var path = '(new file)';
                if (typeof $route.current.$$route.noAutoBreadcrumb === 'undefined') {
                    path = $route.current.params.path;
                }
                this.setBreadcrumbFiles(path);
            }
        };

        this.load = function() {
            if(angular.isDefined(AccountProfile.login)) {
                this.init(AccountProfile.login, true);
            }
            else{
                this.init(UserProfile.login, false);
            }
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
