'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:files
 * @description
 * # files
 */
angular.module('waxeApp')
    .directive('files', function () {
        return {
            template: '<div class="col-md-6" ng-repeat="file in files" ng-class="\'versioning-\' + file.status"><file data="file" selected="selected"></file></div>',
            restrict: 'E',
            scope: {
                'files': '=data',
            }
        };
    });
