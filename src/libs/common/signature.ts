import { Signature } from "../model/utils";
import { Utxos } from "../model/btc";
const Bitcore = require('bitcore-lib');

/**
 * 多签组装签名消息
 * @param signMsg 
 * @param inputs 
 */
function getMutiSignSignature(signMsg: Array<any>, utxos: Utxos) {
    const signatures: Array<Signature> = new Array<Signature>();
    signMsg.forEach((item, index) => {
        signatures.push({
            txid: utxos[index].txid,
            sign: item
        });
    })
    return signatures;
}
/**
 * 组装签名消息-返回后端
 * @param signMsg 签名消息
 * @param isTrezor 是否trezor
 */
function getSignature(signMsg: any, isTrezor: boolean): Array<Signature> {
    const signatures: Array<Signature> = new Array<Signature>();
    const tx: any = new Bitcore.Transaction(signMsg);
    tx.inputs.forEach((vin) => {
        let sign: string = vin.script.chunks[0].buf.toString('hex');
        if (isTrezor) {
            sign = sign.substring(0, sign.length - 2);
        }
        signatures.push({
            txid: vin.prevTxId.toString('hex'),
            sign: sign
        });
    });
    return signatures;
}
export {
    getSignature,
    getMutiSignSignature
}
