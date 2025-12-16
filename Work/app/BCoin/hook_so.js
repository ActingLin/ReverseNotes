var base = Module.findBaseAddress("libns.so");
var func_13644 = base.add(0x13644);
Interceptor.attach(func_13644, {
    onEnter: function(args) {
        console.log("----------进入jointMd5----------");
        console.log("args[0]:", args[0].readCString());
        console.log("args[1]:", args[1].readCString());
    }, onLeave: function(retval) {
        console.log("--------------------------------");
    }
})

var key = base.add(0x1014C);
var iv = base.add(0x10158);
Interceptor.attach(key, {
    onEnter: function(args) {
        console.log("----------进入key----------");
    }, onLeave: function(retval) {
        console.log("getKey() 返回值:", hexdump(retval, {length:16}));
        console.log("--------------------------------");
    }
})
Interceptor.attach(iv, {
    onEnter: function(args) {
        console.log("----------进入iv----------");
    }, onLeave: function(retval) {
        console.log("getIV() 返回值:", hexdump(retval, {length:16}));
        console.log("--------------------------------");
    }
})