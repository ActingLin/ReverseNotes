
window.arrayBufferToHex = function arrayBufferToHex(buffer){
    let hex = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    console.log(len)
    for (let i = 0; i < len; i++) {
        //将每个字节转换为两位的十六进制字符串
        const byteHex = bytes[i].toString(16).padStart(2, '0');
        hex += byteHex;
    }
    return hex;
}
