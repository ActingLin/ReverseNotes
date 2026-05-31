(function() {
    'use strict';
    var _eval = window.eval;
    window.eval = function(x) {
        _eval(x.replace("debugger;", "  ; "));
    };
    window.eval.toString = _eval.toString;
})();