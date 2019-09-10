import { rlp } from "ethereumjs-util";
import { Result } from '../model/utils';
import { BtcSeriesEntity, Utxos } from '../model/btc';
import { EthEntity } from '../model/eth';
import { LedgerTransport } from "./transport";
import { getSignature, getMutiSignSignature } from "../common/signature";
import { writeInfoLog } from "../common/logger";
const Tx = require('ethereumjs-tx');
class LedgerTransaction {
    private transport: any;
    private coin_type: string;
    private version: number = 1;
    /**
     * 交易签名函数类
     * @param coinType 币种
     */
    constructor(coinType: string) {
        this.coin_type = coinType;
        writeInfoLog(`初始化交易签名函数类.`);
    }

    /**
     * eth sign
     * @param path 
     * @param entity 
     */
    public async signEth(path: string, entity: EthEntity): Promise<Result> {
        try {
            writeInfoLog(`Eth交易签名.`);
            let res: Result = {};
            let signed: any;
            const tx = new Tx(entity);
            const rawTxHex = rlp.encode(tx.raw).toString('hex');
            this.transport = await new LedgerTransport(this.coin_type).getTransport();
            writeInfoLog(`多签Btc系列硬件执行签名，等待硬件确认操作.`);
            signed = await this.transport.signTransaction(path, rawTxHex);
            writeInfoLog(`多签Btc系列硬件签名完成.`);
            res = {
                success: true,
                message: "",
                v: signed.v,
                r: signed.r,
                s: signed.s,
            };
            return res;
        } catch (error) {
            throw new Error(`Eth硬件签名失败，错误信息：${error.message}`);
        }
    }

    /**
     * support btc series coin sign,include btc,bch,ltc.
     * @param {BtcEntity} entity
     * @param {utxos} utxos
     * @returns {Promise<Result>}
     */
    public async signBtcSeries(entity: BtcSeriesEntity, utxos: Utxos): Promise<Result> {
        try {
            writeInfoLog(`Btc系列交易签名.`);
            let signed: any;
            this.transport = await new LedgerTransport(this.coin_type).getTransport();
            if (!entity.isMutiSign) {
                writeInfoLog(`多签Btc系列硬件执行签名，等待硬件确认操作.`);
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
                );
                writeInfoLog(`多签Btc系列硬件签名完成.`);
            } else {
                signed = await this.transport.signP2SHTransaction(entity.inputs, entity.paths, entity.outputScript);
            }
            let res: Result = {
                success: true,
                message: "",
                signatures: entity.isMutiSign ? getMutiSignSignature(signed, utxos) : getSignature(signed, false),
                version: this.version
            };
            return res;
        } catch (error) {
            throw new Error(`${this.coin_type}硬件签名失败，错误信息：${error.message}`);
        }

    }
}

export {
    LedgerTransaction
}
