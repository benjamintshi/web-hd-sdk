import buildOutputScript from 'build-output-script';
import { Unit } from 'bitcore-lib';
import { BtcSeriesEntity, BtcSeriesData, Utxo, OutPut, TX_SPLIT_API } from '../model/btc';
import { zip } from 'lodash';
import { LedgerTransport } from './transport'
import { EthEntity, EthData } from '../model/eth';
import { toHex, numberToHex } from 'web3-utils';
import { convert } from 'ethereumjs-units';
import { CoinType } from '../model/utils';
import { convertCoinAddress } from '../common/convert';
import { writeInfoLog } from '../common/logger';
const axios = require('axios');

class LedgerLogic {
    private transport?: LedgerTransport;
    private coin_type: string;
    /**
     * 交易签名逻辑处理类
     * @param coinType 
     */
    constructor(coinType: string) {
        this.coin_type = coinType;
        writeInfoLog(`初始化交易签名逻辑处理类.`);
    }

    /**
     * 组装ledger签名实体对象
     * @param data 
     */
    public async getLedgerEntity(data: any): Promise<any> {
        writeInfoLog(`构造ledger签名实体对象.`);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.getEthLedgerEntity(data);
            case CoinType.BTC:
            default:
                return await this.getBtcSeriesLedgerEntity(data);
        }
    }

    /**
     * 构造ledger签名实体对象:BTC系列：btc、bch、ltc
     * @param data 
     */
    private async getBtcSeriesLedgerEntity(data: BtcSeriesData): Promise<BtcSeriesEntity> {
        writeInfoLog(`构造ledger btc系列 签名实体对象`);
        let entity: BtcSeriesEntity = {
            isMutiSign: data.input.paths.length > 1,
            inputs: await this.getBtcSeriesLedgerInputs(data),
            outputScript: await this.getBtcSeriesLedgerOutputScript(data.outputs),
            segwit: false,
            paths: Array(data.utxos.length).fill(data.input.paths[data.input.signIndex].path)
        }
        return entity;
    }

    /**
     * 构造ledger签名实体对象:ETH
     * @param data 
     */
    private async getEthLedgerEntity(data: EthData): Promise<EthEntity> {
        try {
            writeInfoLog(`构造ledger eth 签名实体对象`);
            let entity: EthEntity = {
                nonce: numberToHex(data.nonce),
                gasPrice: numberToHex(data.gasPrice),
                gasLimit: numberToHex(data.gasLimit),
                to: toHex(data.toAddress),
                value: numberToHex(convert(data.txnCoinNum, 'eth', 'wei')),
                data: data.data ? data.data : '',
                chainId: numberToHex(data.chainId)
            }
            return entity;
        } catch (error) {
            throw new Error(`构造ledger eth 签名实体对象失败，错误信息：${error.message}`);
        }
    }


    /**
     * btc系列签名 报文解析组装签名所需inputs、格式化地址支持bch、ltc，多签需要赎回脚本
     * @param data 
     */
    private async getBtcSeriesLedgerInputs(data: BtcSeriesData): Promise<any> {
        //格式化地址
        data.input.address = convertCoinAddress(data.input.address, this.coin_type);
        let inputs: any = await this.getBtcSeriesTxInputsByUtxo(data.utxos);
        //多签：需要赎回脚本
        if (data.input.paths.length > 1) {
            inputs.forEach(element => {
                element.push(data.input.redeemScript);
            });
        }
        return inputs;
    }

    /**
     * btc系列签名 utxo hax 报文解析组装签名所需inputs
     * @param listUtxo 
     */
    private async getBtcSeriesTxInputsByUtxo(listUtxo: Array<Utxo>): Promise<any> {
        try {
            writeInfoLog(`ledger btc系列 utxo txid报文解析.`);
            this.transport = new LedgerTransport(this.coin_type);
            const transport: any = await this.transport.getTransport();
            let splitTxs: Array<any> = new Array<any>();
            let indexs: Array<number> = new Array<number>();
            let txApiUrl: string;
            for (let element of listUtxo) {
                switch (this.coin_type) {
                    case CoinType.BCH:
                        txApiUrl = `${TX_SPLIT_API.BCH}/${element.txid}/hex`;
                        break;
                    case CoinType.LTC:
                        txApiUrl = `${TX_SPLIT_API.LTC}/${element.txid}`;
                        break;
                    case CoinType.BTC:
                    default:
                        txApiUrl = `${TX_SPLIT_API.BTC}/${element.txid}/hex`;
                        break;
                }
                let res: any = await axios.get(txApiUrl);
                for (let i = 0; i < res.data.length; i++) {
                    let swegit: boolean = res.data[i].hex.substring(8, 8 + 2) == "00" ? true : false;
                    let splitTx: any = await transport.splitTransaction(res.data[i].hex, swegit, undefined);
                    splitTxs.push(splitTx);
                    indexs.push(listUtxo[i].index);
                }
            }
            return zip(splitTxs, indexs);
        } catch (error) {
            throw new Error(`获取utxo txid报文解析失败，错误信息：${error.message}`)
        }

    }

    /**
     * btc系列签名锁定脚本
     * @param listOutput 
     */
    private async getBtcSeriesLedgerOutputScript(listOutput: Array<OutPut>): Promise<string> {
        try {
            let tmp: Array<any> = new Array<any>();
            listOutput.forEach(element => {
                tmp.push({
                    address: convertCoinAddress(element.address, this.coin_type),
                    value: Unit.fromBTC(element.coinNum).toSatoshis()
                });
            });
            writeInfoLog(`ledger btc系列 签名锁定脚本.`);
            return buildOutputScript(tmp);
        } catch (error) {
            throw new Error(`构造ledger btc系列 签名锁定脚本失败，错误信息：${error.message}`);
        }

    }
}

export {
    LedgerLogic
}