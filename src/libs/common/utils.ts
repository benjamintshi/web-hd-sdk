/**
 * 压缩公钥
 * @param publicKey 
 */
function getCompressPublicKey(publicKey: string): string {
    let index: string;
    if (publicKey.substring(0, 2) !== "04") {
        return publicKey;
    }
    if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
        index = "03";
    } else {
        index = "02";
    }
    return index + publicKey.substring(2, 66);
}

export {
    getCompressPublicKey
}
