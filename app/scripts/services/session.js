'use strict';

/**
 * @ngdoc service
 * @name waxeangularApp.Session
 * @description
 * # Session
 * Factory in the waxeangularApp.
 */
angular.module('waxeApp')
    .service('Session', function (UrlFactory) {
        this.currentFile = null;
        this.user = null;
        this.breadcrumbFiles = [];

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
            if (typeof this.currentFile === 'undefined') {
                this.breadcrumbFiles = [{name: 'root'}];
                return;
            }
            this.breadcrumbFiles = [{
                'name': 'root',
                'link': UrlFactory.urlFor(this.user, '')
            }];
            var lis = this.currentFile.split('/');
            var path = '';
            for (var i=0, len=lis.length; i < len; i++) {
                if (i > 0) {
                    path += '/';
                }
                path += lis[i];
                var o = {
                    'name': lis[i],
                };
                if (i < len -1) {
                    o.link = UrlFactory.urlFor(this.user, '', {'path': path});
                }
                this.breadcrumbFiles.push(o);
            }
        };
    });
