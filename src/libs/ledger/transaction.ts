import { rlp } from "ethereumjs-util";
import { Result } from '../model/utils';
import { BtcSeriesEntity, Utxos } from '../model/btc';
import { EthEntity } from '../model/eth';
import { LedgerTransport } from "./transport";
import { getSignature, getMutiSignSignature } from "../common/signature";
const Tx = require('ethereumjs-tx');
class LedgerTransaction {
    private transport: any;
    private coin_type: string;
    private version: number = 1;
    constructor(coinType: string) {
        this.coin_type = coinType;
    }

    /**
     * eth sign
     * @param path 
     * @param entity 
     */
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
     * @param {utxos} utxos
     * @returns {Promise<Result>}
     */
    public async signBtcSeries(entity: BtcSeriesEntity, utxos: Utxos): Promise<Result> {
        let signed: any;
        this.transport = await new LedgerTransport(this.coin_type).getTransport();
        if (!entity.isMutiSign) {
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
        debugger
        let res: Result = {
            success: true,
            message: "",
            signatures: entity.isMutiSign ? getMutiSignSignature(signed, utxos) : getSignature(signed, false),
            version: this.version
        };
        return res;
    }
}

export {
    LedgerTransaction
}
