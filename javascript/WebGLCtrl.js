/* WebGL Page controller  */

/* No global variables! */
(function(){

  /* grab the main app module */
  var app = angular.module('githubSite'); // defined in app.js

  /* Define our controller */
  var WebGLCtrl = function($scope) {

    $scope.pageTitle = "WebGL Page";
    $scope.pageSubTitle = "Home Page";
	
	/* Run our opengl code on load */
	$scope.$on('$ionicView.enter', function(){
		alert('page loaded! or something');
	});

  };

  /* Register our controller */
  app.controller('WebGLCtrl', ["$scope", WebGLCtrl]);

}());