// var base = Module.findBaseAddress("libns.so");
// var func_13644 = base.add(0x13644);
// Interceptor.attach(func_13644, {
//     onEnter: function(args) {
//         console.log("----------进入jointMd5----------");
//         console.log("args[0]:", args[0].readCString());
//         console.log("args[1]:", args[1].readCString());
//     }, onLeave: function(retval) {
//         console.log("--------------------------------");
//     }
// })
//
// var key = base.add(0x1014C);
// var iv = base.add(0x10158);
// Interceptor.attach(key, {
//     onEnter: function(args) {
//         console.log("----------进入key----------");
//     }, onLeave: function(retval) {
//         console.log("getKey() 返回值:", hexdump(retval, {length:16}));
//         console.log("--------------------------------");
//     }
// })
// Interceptor.attach(iv, {
//     onEnter: function(args) {
//         console.log("----------进入iv----------");
//     }, onLeave: function(retval) {
//         console.log("getIV() 返回值:", hexdump(retval, {length:16}));
//         console.log("--------------------------------");
//     }
// })

// var addr = Module.findBaseAddress('libns.so');
//原本  7C1614
// console.log(addr);
// var funcAddr = addr.add(0x124D8);
// console.log(funcAddr);
// Interceptor.attach(funcAddr,{
//     onEnter:function (args){
//         console.log("---------进入了-----------")
//
//         console.log('args0:',hexdump(args[0]))
//         console.log('args1:',hexdump(args[1]))
//     },
//     onLeave:function(retval) {
//         console.log("--------------------")
//         // console.log('返回值：',hexdump(retval,{length:300}))
//     }
// })
//
// var funcAddr1 = addr.add(0x13644);
// console.log(funcAddr1);
// Interceptor.attach(funcAddr1,{
//     onEnter:function (args){
//         console.log("---------jointMd5 进入了-----------")
//
//         console.log('args0:',(args[0].readCString()))
//         console.log('args1:',(args[1].readCString()))
//     },
//     onLeave:function(retval) {
//         console.log("--------------------")
//         // console.log('返回值：',hexdump(retval,{length:300}))
//     }
// })

//
// var funcAddr1 = addr.add(0x117B4);
// console.log(funcAddr1);
// Interceptor.attach(funcAddr1,{
//     onEnter:function (args){
//         console.log("---------jointMd5 进入了-----------")
//
//         console.log('args0:',hexdump(args[0]))
//         console.log('args1:',hexdump(args[1]))
//         console.log('args2:',(args[2]))
//         console.log('args3:',hexdump(args[3]))
//
//         console.log('args4:',hexdump(args[4]))
//
//
//     },
//     onLeave:function(retval) {
//         console.log("--------------------")
//         // console.log('返回值：',hexdump(retval,{length:300}))
//     }
// })

// key
var addr = Module.findBaseAddress('libns.so');
var KEY = addr.add(0x10144);
console.log(KEY);
Interceptor.attach(KEY,{
    onEnter:function (args){
        console.log("---------key 进入了-----------")

    },
    onLeave:function(retval) {
        console.log("--------------------")
        console.log('KEY 返回值：',hexdump(retval,{length:16}))
    }
})
// IV
var addr = Module.findBaseAddress('libns.so');
var IV = addr.add(0x10144);
console.log(IV);
Interceptor.attach(IV,{
    onEnter:function (args){
        console.log("---------IV 进入了-----------")

    },
    onLeave:function(retval) {
        console.log("--------------------")
        console.log('IV 返回值：',hexdump(retval,{length:16}))
    }
})

// sign  2c06cef65865431546fdb751f255508b17236209670982getUserAccountInfoBySecretNew  MD5
//