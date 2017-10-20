/* Define the application/module */

/* No anonymous functions! */ 
(function(){

  /* Grab the module directive */
  var app = angular.module('githubSite', ['ngRoute']);

  /* map directory */
  app.config(function($routeProvider)
  {
    $routeProvider
      .when("/main", {
        templateUrl: "../main.html",
        controller: "MainCtrl"
      })
      .otherwise({
        redirectTo: "/main"
      })
  });

}());