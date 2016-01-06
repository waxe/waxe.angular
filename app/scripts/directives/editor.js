'use strict';

/**
 * @ngdoc directive
 * @name waxeApp.directive:editor
 * @description
 * # editor
 */
angular.module('waxeApp')
    .directive('editor', ['$interval', '$anchorScroll', '$location',  'Session', 'FileUtils', function ($interval, $anchorScroll, $location, Session, FileUtils) {
        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                'html': '='
            },
            link: function postLink(scope, element) {
                element.append(scope.html);
                var listener = scope.$watch(function(){
                    if(element.text()) {
                        $anchorScroll($location.hash());
                        // Remove the watch since the form is fully loaded
                        listener();
                        waxe.form = new waxe.Form(scope.$parent.treeData);
                        Session.form = waxe.form;
                        angular.element(document).on('click', '.btn-external-editor', function() {
                            eval('scope.$parent.' + angular.element(this).attr('ng-click'));
                        });
                    }
                });

                Session.autosave_interval = $interval(function() {
                    if (Session.form && Session.form.filename && Session.form.status === 'updated'){
                        FileUtils.save();
                    }
                }, 1000 * 10);
            }
        };
    }])
    .directive('xmlfilters', [function () {
        return {
            template: '<div class="btn-group pull-right" ng-class="cssClass"><button class="btn btn-default btn-xs" ng-class="{\'active\': filter.active}" title="{{filter.title}}" ng-click="toggle(filter)" ng-repeat="filter in filters">{{filter.name}}</button></div>',
            restrict: 'E',
            scope: {
                'filters': '='
            },
            link: function postLink(scope, element) {
                var $container;
                var cntActive = 0;
                var activeFilter = function(name, active) {
                    if (active) {
                        $container.addClass('xml-filter-' + name);
                        cntActive += 1;
                    }
                    else {
                        $container.removeClass('xml-filter-' + name);
                        cntActive -= 1;
                    }
                    if (cntActive > 0) {
                        $container.addClass('xml-filters');
                    }
                    else {
                        $container.removeClass('xml-filters');
                    }
                };
                if (scope.filters !== null) {
                    var w = scope.$watch(function() {
                        $container = angular.element('.layout-container');
                        if($container.length && angular.isDefined(scope.filters)) {
                            w();
                            element.addClass('has-xml-filters');
                            angular.forEach(scope.filters, function(filter) {
                                if (filter.active) {
                                    activeFilter(filter.name, true);
                                }
                            });
                        }
                    });
                }

                scope.toggle = function(filter) {
                    filter.active = !filter.active;
                    activeFilter(filter.name, filter.active);
                };
            }
        };
    }]);
