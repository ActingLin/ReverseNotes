
Java.perform(function () {
    let C1715S = Java.use("com.bcoin.ns.S");
    C1715S["s"].implementation = function (str) {
        console.log(`C1715S.m2433s is called: str=${str}`);
        let result = this["s"](str);
        console.log(`C1715S.m2433s result=${result}`);
        return result;
    };
})

