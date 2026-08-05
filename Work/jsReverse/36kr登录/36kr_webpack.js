require('./mod')


n = jiazaiqi;
// n(491)
function encode_phoneNum(pNum) {
    var i = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeiLxP4ZavN8qhI+x+whAiFpGWpY9y1AHSQC86qEMBVnmqC8vdZAfxxuQWeQaeMWG07lXhXegTjZ5wn9pHnjg15wbjRGSTfwuZxSFW6sS3GYlrg40ckqAagzIjkE+5OLPsdjVYQyhLfKxj/79oOfjl/lV3rQnk/SSczHW0PEyUbQIDAQAB";
    var t = n(491)
    var r = new t.JSEncrypt;
    r.setPublicKey(i);
    return r.encrypt(pNum);
}


console.log(encode_phoneNum('18899996666'))
