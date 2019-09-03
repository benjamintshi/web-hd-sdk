import { rlp } from "ethereumjs-util";
import {Result, Signature, SignatureResult} from '../model/utils';
import { BtcSeriesEntity } from '../model/btc';
import { EthEntity } from '../model/eth';
import { LedgerTransport } from "./transport";
import { TransactionModel } from "../common/transaction"
const Bitcore = require('bitcore-lib');
const Tx = require('ethereumjs-tx');

class LedgerTransaction {
    private transport: any;
    private coin_type: string;
    private tranactionModel:TransactionModel;
    constructor(coinType: string) {
        this.coin_type = coinType;
        this.tranactionModel = new TransactionModel(false);
    }

    public async signEth(path: string, entity: EthEntity): Promise<Result> {
        let res: Result = {};
        let signed: any;
        const tx = new Tx(entity);
        const rawTxHex = rlp.encode(tx.raw).toString('hex');
        this.transport = await new LedgerTransport(this.coin_type).getTransport();
        signed = await this.transport.signTransaction(path, rawTxHex);
        res = {
            success: true,
            message: "",
            v: signed.v,
            r: signed.r,
            s: signed.s,
        };
        return res;
    }

    /**
     * support btc series coin sign,include btc,bch,ltc.
     * @param {BtcEntity} entity
     * @returns {Promise<Result>}
     */
    public async signBtcSeries(entity: BtcSeriesEntity): Promise<Result> {
        let signed: any;
        this.transport = await new LedgerTransport(this.coin_type).getTransport();
        if (entity.paths.length === 1) {
            signed = await this.transport.createPaymentTransactionNew(
                entity.inputs,
                entity.paths,
                entity.sigHashType ? entity.sigHashType : undefined,//bch
                entity.outputScript,
                undefined,
                undefined,
                entity.segwit,
                undefined ? Math.floor(Date.now() / 1000) - 15 * 60 : undefined,
                entity.additionals ? entity.additionals : undefined //bch
            )
        } else {
            signed = await this.transport.signP2SHTransaction(entity.inputs, entity.paths, entity.outputScript);
        }
        let res: Result = {
            success: true,
            message: "",
            signatures: await this.tranactionModel.getSignature(signed),
            version: this.tranactionModel.getVersion(signed)
        };
        return res;
    }

    // private async getSignature(signMsg: any): Promise<Array<Signature>> {
    //     const tx = new Bitcore.Transaction(signMsg);
    //     const signatures: Array<Signature> = new Array<Signature>();
    //     tx.inputs.forEach((vin) => {
    //         let sign: string = vin.script.chunks[0].buf.toString('hex');
    //         signatures.push({
    //             txid: vin.prevTxId.toString('hex'),
    //             sign: sign
    //         });
    //     })
    //     return signatures;
    // }
    //
    // private getVersion(signMsg: string): (number) {
    //     const tx = new Bitcore.Transaction(signMsg);
    //     return tx.version;
    // }
}

export {
    LedgerTransaction
}
