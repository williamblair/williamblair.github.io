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
            templateUrl: 'templates/canvasphysics.html'
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
    
})();
