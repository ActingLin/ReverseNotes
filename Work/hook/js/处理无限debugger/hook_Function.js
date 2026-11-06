(function() {
    var _Function = Function;
    Function = function () {
        let arr = [];

        for (var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            arg = arg.replaceAll("debugger", "");
            arr.push(arg);
        }

        return _Function.apply(this, arr);
    }
})();