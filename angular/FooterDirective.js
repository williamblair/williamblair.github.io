/* Defines a site navbar directive for angular */
/* Iffy */
(function(){

    /* Get the application module 
     * (Already created in Header directive, so
     * we don't add the [] ) */
    var app = angular.module('mysite');

    /* define the directive */
    var FooterDirective = function () {
        /* Return a new object with the directive properties */
        return {
            template: `
<footer id="myFooter">
    <script>
        var lastMod = document.lastModified;
        document.getElementById("myFooter").innerHTML = "Last Modified: " + lastMod;
    </script>
</footer>
            `
        };
    };

    /* Register the directive */
    app.directive('siteFooter', FooterDirective);

})();

