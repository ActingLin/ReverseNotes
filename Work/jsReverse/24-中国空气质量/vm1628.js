const  ask4u6FbhGV8 = "a0QHmC1Ova5958nC";//AESkey，可自定义
const  asi2hhkBUJbo = "bMu71lHRX6bRmPxU";//密钥偏移量IV，可自定义

const  acky6QolJSJi = "dLRSzDrm8xkryEyL";//AESkey，可自定义
const  acixHVhiNqmK = "fex6AA4zRfVrSPmr";//密钥偏移量IV，可自定义

const  dskQCqpdBOGo = "hEaIOlrX7tlhAOkz";//DESkey，可自定义
const  dsiqYiQHbZQp = "xMBwDXG1HOubUV04";//密钥偏移量IV，可自定义

const  dckCheMkUojW = "oi4aKMxMECWSyTaz";//DESkey，可自定义
const  dciEekKS6Cws = "p2uRrSFcN9oKLrKY";//密钥偏移量IV，可自定义

const aes_local_key = 'emhlbnFpcGFsbWtleQ==';
const aes_local_iv = 'emhlbnFpcGFsbWl2';

var BASE64 = {
    encrypt: function(text) {
        var b = new Base64();
        return b.encode(text);
    },
    decrypt: function(text) {
        var b = new Base64();
        return b.decode(text);
    }
};

var DES = {
 encrypt: function(text, key, iv){
    var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.DES.encrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString();
 },
 decrypt: function(text, key, iv){
    var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.DES.decrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  }
};

var AES = {
  encrypt: function(text, key, iv) {
    var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
    // console.log('real key:', secretkey);
    // console.log('real iv:', secretiv);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.AES.encrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString();
  },
  decrypt: function(text, key, iv) {
    var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.AES.decrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  }
};

var localStorageUtil = {
  save: function(name, value) {
    var text = JSON.stringify(value);
    text = BASE64.encrypt(text);
    text = AES.encrypt(text, aes_local_key, aes_local_iv);
    try {
      localStorage.setItem(name, text);
    } catch (oException) {
      if (oException.name === 'QuotaExceededError') {
        console.log('Local limit exceeded');
        localStorage.clear();
        localStorage.setItem(name, text);
      }
    }
  },
  check: function(name) {
    return localStorage.getItem(name);
  },
  getValue: function(name) {
    var text = localStorage.getItem(name);
    var result = null;
    if (text) {
      text = AES.decrypt(text, aes_local_key, aes_local_iv);
      text = BASE64.decrypt(text);
      result = JSON.parse(text);
    }
    return result;
  },
  remove: function(name) {
    localStorage.removeItem(name);
  }
};

// console.log('base64', BASE64.encrypt('key'));

function dU6tPALZ40l(pKmSFk8) {
  pKmSFk8 = AES.decrypt(pKmSFk8, ask4u6FbhGV8, asi2hhkBUJbo);
  return pKmSFk8;
}

function dqf3PsvG9U(pKmSFk8) {
  pKmSFk8 = DES.decrypt(pKmSFk8, dskQCqpdBOGo, dsiqYiQHbZQp);
  return pKmSFk8;
}

function golmOACJkTUULBcU(key, period) {
    if (typeof period === 'undefined') {
        period = 0;
    }
    var d = DES.encrypt(key);
    d = BASE64.encrypt(key);
    var data = localStorageUtil.getValue(key);
    if (data) { // 判断是否过期
        const time = data.time;
        const current = new Date().getTime();
        if (new Date().getHours() >= 0 && new Date().getHours() < 5 && period > 1) {
            period = 1;
        }
        if (current - (period * 60 * 60 * 1000) > time) { // 更新
           data = null;
        }
        // 防止1-5点用户不打开页面，跨天的情况
        if (new Date().getHours() >= 5 && new Date(time).getDate() !== new Date().getDate() && period === 24) {
           data = null;
        }
    }
    return data;
}

function osZ34YC04S(obj) {
    var newObject = {};
    Object.keys(obj).sort().map(function(key){
      newObject[key] = obj[key];
    });
    return newObject;
}
function dxvERkeEvHbS(data) {
    data = BASE64.decrypt(data);
    data = DES.decrypt(data, dskQCqpdBOGo, dsiqYiQHbZQp);
    data = AES.decrypt(data, ask4u6FbhGV8, asi2hhkBUJbo);
    data = BASE64.decrypt(data);
    return data;
}
var poPBVxzNuafY8Yu = (function(){

function osZ34YC04S(obj){
    var newObject = {};
    Object.keys(obj).sort().map(function(key){
        newObject[key] = obj[key];
    });
    return newObject;
}
return function(m0fhOhhGL, oNLhNQ){
    var aMFs = '3c9208efcfb2f5b843eec8d96de6d48a';
    var cVWG2 = 'WEB';
    var t5GECZQ = new Date().getTime();

    var pKmSFk8 = {
      appId: aMFs,
      method: m0fhOhhGL,
      timestamp: t5GECZQ,
      clienttype: cVWG2,
      object: oNLhNQ,
      secret: hex_md5(aMFs + m0fhOhhGL + t5GECZQ + cVWG2 + JSON.stringify(osZ34YC04S(oNLhNQ)))
    };
    pKmSFk8 = BASE64.encrypt(JSON.stringify(pKmSFk8));
    pKmSFk8 = AES.encrypt(pKmSFk8, acky6QolJSJi, acixHVhiNqmK);
    return pKmSFk8;
};
})();

function sSPnfjolBsGjl66hUEw8(m0fhOhhGL, oBDNNVgaDf, cCLupMFJ7, p5kr85Z) {
    const k1pT = hex_md5(m0fhOhhGL + JSON.stringify(oBDNNVgaDf));

    const dGHdO = golmOACJkTUULBcU(k1pT, p5kr85Z);
    if (!dGHdO) {
        var pKmSFk8 = poPBVxzNuafY8Yu(m0fhOhhGL, oBDNNVgaDf);
        $.ajax({
            url: 'api/historyapi.php',
            data: { hA4Nse2cT: pKmSFk8 },
            type: "post",
            success: function (dGHdO) {
                dGHdO = dxvERkeEvHbS(dGHdO);
                oNLhNQ = JSON.parse(dGHdO);
                if (oNLhNQ.success) {
                    if (p5kr85Z > 0) {
                      oNLhNQ.result.time = new Date().getTime();
                      localStorageUtil.save(k1pT, oNLhNQ.result);
                    }
                    cCLupMFJ7(oNLhNQ.result);
                } else {
                    console.log(oNLhNQ.errcode, oNLhNQ.errmsg);
                }
            }
        });
    } else {
        cCLupMFJ7(dGHdO);
    }
}