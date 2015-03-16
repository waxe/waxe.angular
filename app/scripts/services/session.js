'use strict';

/**
 * @ngdoc service
 * @name waxeangularApp.Session
 * @description
 * # Session
 * Factory in the waxeangularApp.
 */
angular.module('waxeApp')
    .service('Session', function () {
        this.currentFile = null;
        this.user = null;
        this.breadcrumbFiles = [];

        this.updateFromRouteParams = function(routeParams) {
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
            this.breadcrumbFiles = [];
            if (typeof this.currentFile === 'undefined' || this.currentFile === '') {
                this.breadcrumbFiles = [{name: 'root'}];
                return;
            }
            this.breadcrumbFiles = [{
                'name': 'root',
                'path': ''
            }];
            var lis = this.currentFile.split('/');
            var path = '';
            for (var i=0, len=lis.length; i < len; i++) {
                if (i > 0) {
                    path += '/';
                }
                path += lis[i];
                var o = {
                    'name': lis[i]
                };
                if (i < len -1) {
                    o.path = path;
                }
                this.breadcrumbFiles.push(o);
            }
        };
    });
