import buildOutputScript from 'build-output-script';
import { Unit } from 'bitcore-lib';
import { BtcSeriesEntity, BtcSeriesData, Utxo, OutPut } from '../model/btc';
import { zip } from 'lodash';
import { LedgerTransport } from './transport'
import { EthEntity, EthData } from '../model/eth';
import { toHex, numberToHex } from 'web3-utils';
import { convert } from 'ethereumjs-units';
import { CoinType } from '../model/utils';
import { Tools } from '../common/tools';
const axios = require('axios');

class LedgerLogic {
    private transport: LedgerTransport;
    private coin_type: string;

    constructor(coinType: string) {
        this.coin_type = coinType;
        this.transport = new LedgerTransport(coinType);
    }

    public async getLedgerEntity(data: any): Promise<any> {
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.getEthLedgerEntity(data);
            case CoinType.BTC:
                return await this.getBtcLedgerEntity(data);
        }
    }

    private async getBtcLedgerEntity(data: BtcSeriesData): Promise<BtcSeriesEntity> {
        let entity: BtcSeriesEntity = {
            inputs: await this.getLedgerInputs(data),
            outputScript: await this.getLedgerOutputScript(data.outputs),
            segwit: false,
            paths: Array(data.utxos.length).fill(data.input.paths[data.input.signIndex].path)
        }
        return entity;
    }

    private async getEthLedgerEntity(data: EthData): Promise<EthEntity> {
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
    }

    private async getLedgerInputs(data: BtcSeriesData): Promise<any> {
        //格式化地址
        data.input.address = Tools.getCoinAddress(data.input.address, this.coin_type);
        let inputs: any = await this.getTxInputs(data.utxos);
        if (data.input.paths.length > 1) {
            inputs.forEach(element => {
                element.push(data.input.redeemScript);
            });
        }
        return inputs;
    }

    private async getTxInputs(listUtxo: Array<Utxo>): Promise<any> {
        const transport: any = await this.transport.getTransport();
        let ids: Array<string> = new Array<string>();
        let splitTxs: Array<any> = new Array<any>();
        let indexs: Array<number> = new Array<number>();
        listUtxo.forEach((element) => {
            ids.push(element.txid);
        });
        let url = "https://api.ledgerwallet.com/blockchain/v2/btc_testnet/transactions/" + ids.join(',') + "/hex";
        const res = await axios.get(url);
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
            let swegit = data[i].hex.substring(8, 8 + 2) == "00" ? true : false;
            let splitTx = await transport.splitTransaction(data[i].hex, swegit, undefined);
            splitTxs.push(splitTx);
            indexs.push(listUtxo[i].index);
        }
        return zip(splitTxs, indexs);
    }

    private async getLedgerOutputScript(listOutput: Array<OutPut>): Promise<string> {
        let tmp: Array<any> = new Array<any>();
        listOutput.forEach(element => {
            tmp.push({
                address: Tools.getCoinAddress(element.address, this.coin_type),
                value: Unit.fromBTC(element.coinNum).toSatoshis()
            });
        });
        return buildOutputScript(tmp);
    }
}

export {
    LedgerLogic
}