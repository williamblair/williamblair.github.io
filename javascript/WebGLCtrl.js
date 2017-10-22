/* WebGL Page controller  */

/* No global variables! */
(function(){

  /* grab the main app module */
  var app = angular.module('githubSite'); // defined in app.js

  /* Define our controller */
  var MainCtrl = function($scope) {

    $scope.pageTitle = "WebGL Page";
    $scope.pageSubTitle = "Home Page";

  };

  /* Register our controller */
  app.controller('WebGLCtrl', ["$scope", WebGLCtrl]);

}());