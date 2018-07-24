(function() {
    
    /* Get the app instance, don't need to bootstrap this time */
    var app = angular.module("myApp");
    
    /* Define the component */
    var bulmaNav = function() {
        return {
            templateUrl: 'templates/bulmaNavbar.html'
        };
    };
    
    /* Register the component */
    app.directive('bulmaNavbar', bulmaNav);
    
})();
