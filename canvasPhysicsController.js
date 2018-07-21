(function() {

    /* Get the app instance */
    var app = angular.module('myApp');

    /* Create a controller */
    var editorController = function($scope) {
        
        /* Initial load */
        $scope.init = function() {
            console.log('In scope init!');
            
            $(function(){
                $('#editorArea1').load('javascript/canvasPhysics.js', function(){

                    console.log('load performed!');

                    editor = ace.edit("editorArea1");
                    editor.setTheme("ace/theme/monokai");
                    editor.getSession().setMode("ace/mode/javascript");
                    document.getElementById("editorArea1").style.fontSize="14px";

                    /* set the function to run when the button is clicked */
                    var button = document.getElementById('runButton');
                    button.onclick = function() {
                        var animate = new Function(editor.getValue());
                        animate();
                    };

                    /* Run the function when the web page loads */
                    var initialFunc = new Function(editor.getValue());
                    initialFunc();
                });
            });
        }

    };

    /* Register the controller */
    app.controller('canvasPhysicsController', editorController);

})();


