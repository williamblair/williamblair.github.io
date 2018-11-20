(function() {
    
    /* Create the App instance */
    var app = angular.module("myApp", ["ngRoute", "hljs"]);

    /* Set routing params */
    app.config(['$routeProvider', 'hljsServiceProvider', function($routeProvider, hljsServiceProvider) {
        $routeProvider
        .when("/", {
            templateUrl: 'templates/home.html'
        })
        .when("/about", {
            templateUrl: 'templates/about.html'
        })
        .when("/eyeTracker", {
            templateUrl: 'templates/eyeTracker.html'
        })
        .when("/windowManager", {
            templateUrl: 'templates/windowManager.html'
        })
        .when("/canvasPhysics", {
            templateUrl: 'templates/canvasphysics.html',
            controller: 'canvascontroller'
        })
        .when("/memcarduino", {
            templateUrl: 'templates/memcarduino.html'
        })
        .when("/psio", {
            templateUrl: 'templates/psio.html'
        })
        .when("/fbsetbg", {
            templateUrl: 'templates/fbsetbg.html'
        })
        .when("/cppmatrix", {
            templateUrl: 'templates/cppmatrix.html'
        })
        .when("/webgl", {
            templateUrl: 'templates/webgl.html',
            controller: 'webgl2dcontroller'
        })
    }]);

    /* The controller for the page */
    var appController = function($scope) {
        
        $scope.navClick = function() {
            $('.navbar-burger').toggleClass("is-active");
            $('.navbar-menu').toggleClass("is-active");
        }
        
        $scope.changeActiveLink = function(name) {
            $(".menu-list a").removeClass("is-active");
            $(`#${name}`).addClass("is-active");
        }
        
        /* Random image and index for the home page */
        $scope.figures = [
            { caption: "It's a unix system... I know this!", source: "images/itsaunixsystem.jpg"},
            { caption: "...3, 2, 1 Let's Jam", source: "images/bebop.gif"},
            { caption: "Present day... Present time... HaHaHahA!", source: "images/lain.gif"},
            { caption: "As a sentient lifeform, I hereby demand political asylum.", source: "images/ghostkeyboard.gif" }
        ];
        
        $scope.figureIndex = Math.floor(Math.random() * $scope.figures.length);
        
    }

    /* Apply the controller */
    app.controller('appController', appController);

    /* Webgl2d page controller */
    function webgl2dcontroller($scope) {
        $scope.title = "Hello World TEST!";

        /* test injecting the script... */
        var bjtest = function() {
           document.getElementById('testScript').innerHTML = ` 
              <p data-height="480" data-theme-id="0" data-slug-hash="pxQjNW" data-default-tab="js,result" data-user="williamblair" data-pen-title="2D WebGL" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/pxQjNW/">2D WebGL</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
           `;

            document.getElementById('testScript3d').innerHTML = `
              <p data-height="480" data-theme-id="0" data-slug-hash="jeQQmm" data-default-tab="js,result" data-user="williamblair" data-pen-title="WebGL3D" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/jeQQmm/">WebGL3D</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
            `;

            document.getElementById('testCamera3d').innerHTML = `
              <p data-height="480" data-theme-id="0" data-slug-hash="bmZmqv" data-default-tab="js,result" data-user="williamblair" data-pen-title="WebGL3dCamera" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/jeQQmm/">WebGL3dCamera</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
            `;

            document.getElementById('testTeapot').innerHTML = `
              <p data-height="480" data-theme-id="0" data-slug-hash="ePoGLw" data-default-tab="js,result" data-user="williamblair" data-pen-title="WebGLTeapot" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/jeQQmm/">WebGLTeapot</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
            `;

            /* Run the external codepen script */
            var script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            var srcDiv = document.getElementById("testScript");
            srcDiv.appendChild(script);

            /* Same for the 3d version */
            script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            document.getElementById("testScript3d").appendChild(script);

            /* Same for the camera version */
            script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            document.getElementById("testCamera3d").appendChild(script);
            console.log('set inner html!');

            /* Same for the teapot version */
            script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            document.getElementById("testTeapot").appendChild(script);

            console.log('set inner html!');
        }

        bjtest();
    }

    /* Apply the controller */
    app.controller('webgl2dcontroller', webgl2dcontroller);

    /* html canvas page controller */
    function canvascontroller($scope) {

        /* test injecting the script... */
        var bjtest = function() {
           document.getElementById('paintScript').innerHTML = ` 
              <p data-height="480" data-theme-id="0" data-slug-hash="mQepYr" data-default-tab="js,result" data-user="williamblair" data-pen-title="CanvasPaint" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/mQepYr/">CanvasPaint</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
           `;

            document.getElementById('treeScript').innerHTML = `
              <p data-height="480" data-theme-id="0" data-slug-hash="pQjpXZ" data-default-tab="js,result" data-user="williamblair" data-pen-title="CanvasTrees" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/pQjpXZ/">CanvasTrees</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
            `;

            document.getElementById('triangleScript').innerHTML = `
              <p data-height="480" data-theme-id="0" data-slug-hash="NEbzpP" data-default-tab="js,result" data-user="williamblair" data-pen-title="Sierpenski Triangles" class="codepen">See the Pen <a href="https://codepen.io/williamblair/pen/NEbzpP/">Sierpenski Triangles</a> by williamblair (<a href="https://codepen.io/williamblair">@williamblair</a>) on <a href="https://codepen.io">CodePen</a>.</p>
            `;

            /* Run the external codepen script */
            var script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            var srcDiv = document.getElementById("paintScript");
            srcDiv.appendChild(script);

            script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            document.getElementById("treeScript").appendChild(script);

            script = document.createElement('script');
            script.src = 'https://static.codepen.io/assets/embed/ei.js';
            document.getElementById("triangleScript").appendChild(script);

            console.log('set inner html!');
        }

        bjtest();
    }

    /* Apply the controller */
    app.controller('canvascontroller', canvascontroller);
    
})();
