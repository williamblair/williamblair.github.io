/* Defines a site navbar directive for angular */
/* Iffy */
(function(){

    /* Get the application module 
     * (Already created in Header directive, so
     * we don't add the [] ) */
    var app = angular.module('mysite');

    /* define the directive */
    var NavbarDirective = function () {
        /* Return a new object with the directive properties */
        return {
            template: `
<!-- navbar -->
<nav class="navbar sticky-top">
    <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="EyeTracker.html">Eye Tracking</a></li>
        <li class="nav-item"><a class="nav-link" href="canvasphysics.html">HTML5 Canvas Physics</a></li>
        <li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">WebGL</a>
            <div class="dropdown-menu">
                <a class="dropdown-item" href="WebGL1.html">Lesson 1</a>
                <a class="dropdown-item" href="WebGL2.html">Lesson 2</a>
                <a class="dropdown-item" href="WebGL3.html">Lesson 3</a>
                <a class="dropdown-item" href="WebGL4.html">Lesson 4</a>
                <a class="dropdown-item" href="WebGL5.html">Lesson 5</a>
            </div>
        </li>
        <li class="nav-item"><a class="nav-link" href="WindowManager.html">X11 Window Manager</a></li>
        <li class="nav-item"><a class="nav-link" href="CS518/index.html">CS518</a></li>
    </ul>
</nav>
            `
        };
    };

    /* Register the directive */
    app.directive('siteNav', NavbarDirective);

})();

