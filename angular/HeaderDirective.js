/* Defines a site navbar directive for angular */
/* Iffy */
(function(){

    /* Get the application module */
    var app = angular.module('mysite', []);

    /* define the directive */
    var HeaderDirective = function () {
        /* Return a new object with the directive properties */
        return {
            /* The html hilighted code here was generated with prism.js,
             * I added the typedef and type tokens to the css stylesheet */
            template: `
<!-- header -->
<div class="row">
    <div class="col-sm-3">
        <img src="images/suny_poly_logo.png" width="100%" height="100%" style="max-width:200px;"/>
    </div>
    <div class="col-sm-9">
        <div id="titleContainer">
<pre><code id="headerCode"><span class="token typedef">typedef</span> <span class="token type">struct</span> MyInfo
<span class="token punctuation">{</span>
    <span class="token type">char</span> <span class="token operator">*</span>name <span class="token operator">=</span> <span class="token string">"William (BJ) Blair III"</span><span class="token punctuation">;</span>
    <span class="token type">char</span> <span class="token operator">*</span>occupation <span class="token operator">=</span> <span class="token string">"Student"</span><span class="token punctuation">;</span>
    <span class="token type">char</span> <span class="token operator">*</span>school <span class="token operator">=</span> <span class="token string">"SUNY Polytechnic"</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> MyInfo<span class="token punctuation">;</span></code></pre>
        </div>
    </div>
</div>

<hr style="background-color:#FFFFFF;"/>
            `
        };
    };

    /* Register the directive */
    app.directive('siteHeader', HeaderDirective);

})();
