(function() {
    var _Function_prototype_constructor = Function.prototype.constructor;
    Function.prototype.constructor= function (){
        let arr = [];

        for(var i = 0; i < arguments.length; i++){
            let arg = arguments[i];
            arg = arg.replaceAll("debugger", "");
            arr.push(arg);
        }

        return _Function_prototype_constructor.apply(this, arr);
    }
})();