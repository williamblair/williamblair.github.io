(function() {
    
    /* Get the angular app */
    var app = angular.module("myApp");
    
    /* Define the component */
    var figComponent = {
        template: `
        <figure>
            <figcaption>{{ $ctrl.caption }}</figcaption>
            <img ng-src="{{ $ctrl.imgsrc }}"/>
        </figure>
        `,
        
        bindings: {
            caption: '<',
            imgsrc: '<'
        }
    };
    
    /* Register the component */
    app.component('imageFigure', figComponent);
    
})();