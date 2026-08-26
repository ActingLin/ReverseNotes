var exports = Module.enumerateExports("libapp.so");
exports.forEach(function (exp) {
    if (exp.name.indexOf("encrypt") !== -1 || exp.name.indexOf("login") !== -1) {
        console.log("[*] Found: " + exp.name + " @ " + exp.address);
    }
});
