/* Defines a site navbar directive for angular */
/* Iffy */
(function(){

  /* Get the application module */
  var app = angular.module('bjSite', []);

  /* define the directive */
  var NavbarDirective = function () {
    /* Return a new object with the directive properties */
    return {
      templateUrl: '../NavbarDirective.html'
    };
  };

  /* Register the directive */
  app.directive('siteNav', NavbarDirective);

})();