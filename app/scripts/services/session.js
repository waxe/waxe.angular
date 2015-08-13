'use strict';

/**
 * @ngdoc service
 * @name waxeangularApp.Session
 * @description
 * # Session
 * Factory in the waxeangularApp.
 */
angular.module('waxeApp')
    .service('Session', ['$http', '$q', '$route', 'Utils', 'UserProfile', 'AccountProfile', function ($http, $q, $route, Utils, UserProfile, AccountProfile) {

        // The variables defined here should not be reset during the navigation.
        // It's like a cache

        // The current path we open/save file. It's used in the modal
        this.currentPath = null;

        // The interval object when editing a file. We need it to cancel it
        // when we quit the editor.
        this.autosave_interval = null;


        this.init = function(login, accountUsable) {
            this.login = login;
            // Should be true when we can use the account data
            this.accountUsable = accountUsable;
            this.currentFile = null;
            this.user = null;
            this.breadcrumbFiles = [];

            // If true we display the input to filter the files displayed
            this.showFileFilter = false;
            // The file filter to use on ng-model
            // this.fileFilter

            // Special handler when we click on the save button
            this.submitForm = null;
            // We have a form, we should enable the save button
            this.hasForm = null;
            // XML form
            // NOTE: it enables the 'save as' button
            this.form = null;

            this.from = $route.current.params.from;
            this.editor = (typeof $route.current.$$route.editor !== 'undefined');
            this.diff = (typeof $route.current.$$route.diff !== 'undefined');

            this.showSource = this.editor || this.diff;
            this.sourceEnabled = false;

            if(this.editor && typeof this.from !== 'undefined') {
                this.sourceEnabled = true;
            }

            this.showDiff = (AccountProfile.has_versioning && (this.diff || this.editor));
            this.diffEnabled = false;
            if(this.diff && typeof this.from !== 'undefined') {
                this.diffEnabled = true;
            }

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
    }]);
