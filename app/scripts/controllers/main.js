'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
