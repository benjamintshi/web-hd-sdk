import { Signature } from "../model/utils";
import { Utxos } from "../model/btc";
const Bitcore = require('bitcore-lib');

/**
 * 构造多签交易签名消息
 * @param signMsg 
 * @param inputs 
 */
function getMutiSignSignature(signMsg: Array<any>, utxos: Utxos) {
    try {
        const signatures: Array<Signature> = new Array<Signature>();
        signMsg.forEach((item, index) => {
            signatures.push({
                txid: utxos[index].txid,
                sign: item
            });
        })
        return signatures;
    } catch (error) {
        throw new Error(`构造多签交易签名消息失败，错误信息：${error.message}`);
    }
}
/**
 * 构造交易签名消息-返回后端
 * @param signMsg 签名消息
 * @param isTrezor 是否trezor
 */
function getSignature(signMsg: any, isTrezor: boolean): Array<Signature> {
    try {
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
    } catch (error) {
        throw new Error(`构造交易签名消息失败，错误信息：${error.message}`);
    }
}
export {
    getSignature,
    getMutiSignSignature
}
