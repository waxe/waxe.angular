'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
    .controller('EditCtrl', ['$scope', '$http', '$sce', '$routeParams', '$route', '$location', '$compile', 'UrlFactory', 'Session', 'NavbarService', function ($scope, $http, $sce, $routeParams, $route, $location, $compile, UrlFactory, Session, NavbarService) {
        $scope.xml_filters = (typeof XML_FILTERS !== 'undefined')? XML_FILTERS: null;
        var action = $route.current.$$route.action;
        var url = UrlFactory.jsonAPIUserUrl($routeParams.type+'/'+action);
        $http
            .get(url, {params: $routeParams})
            .then(function(res) {
                $scope.html = res.data.content;
                $scope.treeData = res.data.jstree_data;
                Session.filename = $routeParams.path;
                NavbarService.setEditFile(true, true);
                $scope.$emit('pageLoaded');
            }, function() {
                // Seems like there is a problem to display the XML file, we
                // try to display it as txt.
                // TODO: Do not redirect on 404
                var redirect = UrlFactory.userUrl('txt/'+action);
                var path = $location.path();
                $location.path(redirect).search({path: $routeParams.path, from: path, fromtype: 'source'});
            });

        $scope.external_current = -1;
        $scope.external_values = [];

        $scope.closeExternalEditor = function() {
            $scope.showExternalEditor = false;
        };


        var startX, startY;

        var el = angular.element('.external-editor');
        el.bind('dragstart', function(e) {
            startX = e.originalEvent.clientX;
            startY = e.originalEvent.clientY;
        });

        el.bind('dragend', function(e) {
            var endX = e.originalEvent.clientX,
                endY = e.originalEvent.clientY,
                pos =el.position(),
                posX = pos.left,
                posY = pos.top,
                newPosX = posX - (startX - endX),
                newPosY = posY - (startY - endY);

            el.css({
                'left': newPosX,
                'top': newPosY,
                'right': 'auto',
                'bottom': 'auto'
            });
        });


        $scope.externalResetSizeAndPosition = function() {
            el.removeAttr('style').find('.modal-content').removeAttr('style');
        };

        $scope.externalEditor = function(btn) {

            var element = angular.element(btn).parent().attr('id');
            // We have the logic in xmltool.jstree select_node.jstree to get
            // the focus on the textarea or the contenteditable. We should make
            // a function of this
            var $textElt = angular.element(xmltool.utils.escapeAttr('#' + element)).find('textarea:not(._comment):first');

            $scope.$apply(function() {
                $scope.externalIsContenteditable = false;
                var html_func;
                if (!$textElt.is(':visible')) {
                    // Element is a contenteditable
                    $textElt = $textElt.next();
                    $scope.externalIsContenteditable = true;
                    html_func = function() {
                        return $textElt.html.apply($textElt, arguments);
                    };
                }
                else {
                    html_func = function() {
                        return $textElt.val.apply($textElt, arguments);
                    };
                }

                var html = html_func();
                $scope.external_values.push(html);
                $scope.externalElt = $textElt;
                $scope.external_current++;

                $textElt.attr('ng-model', 'external_values['+$scope.external_current+']');
                // We remove the HTML for compiling in case there is some
                // '{{}}' in the HTML
                html_func('');
                $compile($textElt)($scope);
                html_func(html);
                $scope.showExternalEditor = true;

            });
        };

        $scope.scrollToElement = function() {
            // #xml-editor-form-container is already defined in waxe.core we shouldn't redefined it
            xmltool.utils.scrollToElement($scope.externalElt, angular.element('#xml-editor-form-container'));
            $scope.externalElt.focus();
        };
    }]);
