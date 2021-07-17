({
    insertRequire: false,
    baseUrl: '/web/js',
    out: 'public/js/main.min.js',
    findNestedDependencies: true, 
    //optimize: 'none',   
    name: "main",   
    paths: {     'knockout': 'libs/knockout/knockout-3.3.0',     'jquery': 'libs/jquery/jquery-2.1.3.min',     'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.11.4.min',     'promise': 'libs/es6-promise/promise-1.0.0.min',     'hammerjs': 'libs/hammer/hammer-2.0.4.min',     'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',     'ojs': 'libs/oj/v1.1.2/min',     'ojL10n': 'libs/oj/v1.1.2/ojL10n',     'ojtranslations': 'libs/oj/v1.1.2/resources',     'signals': 'libs/js-signals/signals.min',     'text': 'libs/require/text'   },   
    shim: {     jquery: {       exports: '$'     }   },   
})