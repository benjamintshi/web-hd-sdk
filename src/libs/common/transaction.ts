import {Signature} from "../model/utils";
const Bitcore = require('bitcore-lib');
class TransactionModel{
    private isTrezor:boolean;
    constructor(isTrezor){
        this.isTrezor = isTrezor;
    }
    /**
     *获取签名
     *
     * */
    public  getSignature(signMsg: any ,isMutliSign?:any): Array<Signature>  {
        const tx = new Bitcore.Transaction(signMsg);
        const signatures: Array<Signature> = new Array<Signature>();
        let index = isMutliSign == true ? 1 : 0;
        tx.inputs.forEach((vin) => {
            let sign: string = vin.script.chunks[index].buf.toString('hex');
            if(this.isTrezor){
                sign =  sign.substring(0, sign.length - 2);
            }
            signatures.push({
                txid: vin.prevTxId.toString('hex'),
                sign: sign
            });
        })
        return signatures;
    }
    /**
     *获取签名版本
     *
     * */
    public getVersion(signMsg: string): (number) {
        const tx = new Bitcore.Transaction(signMsg);
        return tx.version;
    }
}
export {
    TransactionModel
}
