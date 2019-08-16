import { rlp } from "ethereumjs-util";
import { Result, Signature } from '../common/utils';
import { BtcEntity } from '../model/btc';
import { EthEntity } from '../model/eth';
const Bitcore = require('bitcore-lib');
const Tx = require('ethereumjs-tx');
class LedgerTransaction {
    constructor() {
    }
    public async signEth(path: string, entity: EthEntity, transport: any): Promise<Result> {
        let res: Result = {};
        let signed: any;
        const tx = new Tx(entity);
        const rawTxHex = rlp.encode(tx.raw).toString('hex');
        signed = await transport.signTransaction(path, rawTxHex);
        res = {
            success: true,
            message: "",
            v: signed.v,
            r: signed.r,
            s: signed.s,
        };
        return res;
    }
    public async signBtc(entity: BtcEntity, transport: any): Promise<Result> {
        debugger
        let signed: any;
        if (entity.paths.length === 1) {
            signed = await transport.createPaymentTransactionNew(
                entity.inputs,
                entity.paths,
                undefined,
                entity.outputScript,
                undefined,
                undefined,
                entity.segwit,
                undefined ? Math.floor(Date.now() / 1000) - 15 * 60 : undefined
            )
        } else {
            signed = await transport.signP2SHTransaction(entity.inputs, entity.paths, entity.outputScript);
        }
        debugger
        let res: Result = {
            success: true,
            message: "",
            signatures: await this.getSignature(signed),
            version: this.getVersion(signed)
        };
        return res;
    }
    private async getSignature(signMsg: any): Promise<Array<Signature>> {
        debugger
        const tx = new Bitcore.Transaction(signMsg);
        const signatures: Array<Signature> = new Array<Signature>();
        tx.inputs.forEach((vin) => {
            let sign: string = vin.script.chunks[0].buf.toString('hex');
            signatures.push({
                txid: vin.prevTxId.toString('hex'),
                sign: sign
            });
        })
        return signatures;
    }
    private getVersion(signMsg: string): (number) {
        debugger
        const tx = new Bitcore.Transaction(signMsg);
        return tx.version;
    }
}
export {
    LedgerTransaction
}