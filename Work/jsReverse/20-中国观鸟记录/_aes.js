var window = globalThis;

(function (p2) {
  function f4() {
    this.key = "6756696653534952657053656868665752665050485566485667545454484967";
    this.iv = "53536868555767547048526949655455";
  }
  f4.prototype.getMapping = function (p8) {
    var vLS = "";
    for (var vLN0 = 0; vLN0 < p8.length; vLN0 += 2) {
      var v9 = p8.substring(vLN0, vLN0 + 2);
      vLS += String.fromCharCode(v9);
    }
    return vLS;
  };
  f4.prototype.aes_encode = function (p9) {
    var v10 = CryptoJS.enc.Utf8.parse(this.getMapping(this.key));
    var v11 = CryptoJS.enc.Utf8.parse(this.getMapping(this.iv));
    return p9 = CryptoJS.AES.encrypt(p9, v10, {
      iv: v11,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  };
  f4.prototype.decode = function (p10) {
    var v12 = CryptoJS.enc.Utf8.parse(this.getMapping(this.key));
    var v13 = CryptoJS.enc.Utf8.parse(this.getMapping(this.iv));
    return CryptoJS.AES.decrypt(p10, v12, {
      iv: v13,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  };
  p2.BIRDREPORT_APIJS = new f4();
})(window);


getMapping = function (p8) {
    var vLS = "";
    for (var vLN0 = 0; vLN0 < p8.length; vLN0 += 2) {
      var v9 = p8.substring(vLN0, vLN0 + 2);
      vLS += String.fromCharCode(v9);
    }
    return vLS;
};

var key = "6756696653534952657053656868665752665050485566485667545454484967";
var iv = "53536868555767547048526949655455";

console.log(getMapping(key))
console.log(getMapping(iv))
// C8EB5514AF5ADDB94B2207B08C66601C
// 55DD79C6F04E1A67
