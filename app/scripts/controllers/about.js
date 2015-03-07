'use strict';

/**
 * @ngdoc function
 * @name waxeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the waxeApp
 */
angular.module('waxeApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
