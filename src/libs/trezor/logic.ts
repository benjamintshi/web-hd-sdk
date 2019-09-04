import {Result} from "../model/utils";


import {toHex, numberToHex} from 'web3-utils';
import {convert} from 'ethereumjs-units';
import {EthEntity, dealWithInputsResult, trezorBtcEntityResult} from "../model/eth";
import {SEND_ENUM, PAY_ENUM} from "../model/btc";
import trezor from "trezor-connect";

const bitcoinjslib = require("bitcoinjs-lib");
const bitcore = require("bitcore-lib");
const util = require("util");
import * as BipPath from "bip32-path";

/**
 ExTrezorManager 扩展对象
 钱包:Ledger
 */
trezor.manifest({
    email: 'xiongjie@invault.io',
    appUrl: 'https://localhost'
});

class TrezorLogic {


    private coin_type: string;

    constructor(coinType: string) {
        this.coin_type = coinType;

    }

    public async getBtcTrezorEntity(data: any): Promise<trezorBtcEntityResult> {
        return {
            inputs: await this.getTrezorInputs(data),
            outputs: await this.getTrezorOutputs(data.outputs),
            multisig: data.input && data.input.paths && data.input.paths.length > 1 ? true : false
        }

    }

    /**
     获取trezor的inputs的数据结构
     @param      utxos        未花费的交易数组
     @param      paths        构成转出地址的路径数组
     @param      signIndex      当前用于签名的路径序号
     @param      requires      最小签名数量
     @param      envCoin
     @param      redeemScript  赎回脚本
     @return      返回trezor可用的inputs
     **/
    public async getTrezorInputs(data: any): Promise<any> {
        let inputs: Array<any> = [], input: any = {};
        let dataInput: any = data.input;

        data.utxos.forEach(utxo => {
            input = {
                address_n: BipPath.fromString(dataInput.paths[dataInput.signIndex].path).toPathArray(),
                prev_index: utxo.index,
                prev_hash: utxo.txid
            }
            input.script_type = dataInput.paths[dataInput.signIndex].addressType;
            input.amount = JSON.stringify(bitcore.Unit.fromBTC(utxo.coinNum).toSatoshis());

            inputs.push(input);
        });
        //多签地址
        if (dataInput.paths.length > 1) {
            let pubkeys: any = [];
            dataInput.paths.forEach(path => {
                let address_n = BipPath.fromString(path.path).toPathArray();
                address_n.splice(0, 3);
                pubkeys.push({
                    node: path.xpub,
                    address_n: address_n
                });

            });


            inputs.forEach(input => {
                input.script_type = SEND_ENUM.multi;
                input.multisig = {};
                input.multisig.pubkeys = pubkeys;
                input.multisig.signatures = Array(pubkeys.length).fill("");		//数组为引用类型，因此通过新的变量赋值
                input.multisig.m = dataInput.requires;
            });
        }
        return inputs;
    }

    /**
     * 获取 trezor 需要的 outputs 结构
     * @param outputs
     * @returns {Promise<Array>}
     */
    private async getTrezorOutputs(outputs) {
        let tmpArray: Array<any> = [];
        outputs.forEach(output => {
            if (!output.address && output.coinNum === 0) {
                tmpArray.push({
                    op_return_data: output.hex.substr(4),
                    amount: '0',
                    script_type: PAY_ENUM.op_return_type
                });
            } else {
                tmpArray.push({
                    address: output.address,
                    amount: JSON.stringify(bitcore.Unit.fromBTC(output.coinNum).toSatoshis()),
                    script_type: output.isScript ? PAY_ENUM.p2sh : PAY_ENUM.p2pkh
                });
            }
        });
        return tmpArray;
    }

    // 处理BCH、LTC中paths顺序以及signIndex字段
    public dealWithInputs(dataInputs): dealWithInputsResult {
        // decode redeemScript, 取其中的publicKey
        let redeemBuf: any = bitcoinjslib.script.decompile(Buffer.from(dataInputs.redeemScript, 'hex'));
        let newPaths: Array<any> = new Array();
        let newSignIndex: any = null;
        redeemBuf.forEach(item => {
            let index = 0;
            if (util.isBuffer(item)) {
                // p.push(item.toString('hex'));
                if (dataInputs.paths[dataInputs.signIndex].addressPublicKey === item.toString('hex')) {
                    newSignIndex = index;
                }
                dataInputs.paths.forEach(path => {
                    if (path.addressPublicKey === item.toString('hex')) {
                        newPaths.push(path)
                    }
                });
                index++;
            }
        });
        dataInputs.paths = newPaths;
        dataInputs.signIndex = newSignIndex;

        return dataInputs;

    }

    /**
     * 获取签名需要返回的数据  - ETH
     * @param data      服务返回签名所需要的数据
     * @returns transaction  返回交易对象
     */
    public getTransactionDataForEth(data): EthEntity {

        let signEthereumData: EthEntity = {
            // path: data.input.path,
            nonce: numberToHex(data.nonce),
            gasPrice: numberToHex(data.gasPrice),
            gasLimit: numberToHex(data.gasLimit),
            to: toHex(data.toAddress),
            value: numberToHex(convert(data.txnCoinNum, 'eth', 'wei')),
            data: data.data == null ? '' : toHex(data.data),
            chainId: Number(data.chainId)
        }
        return signEthereumData;
    }

    /**
     * 硬件签名 - ETH
     * @param ts
     * @param callback
     * @returns {Promise<void>}
     */
    public async trezorSignTxForEth(ts, path) {
        let signData = {
            path: path,
            transaction: ts
        };
        let result: Result = {
            success: false
        };
        let res: any = await trezor.ethereumSignTransaction(signData);
        if (res.success) {
            result = {
                success: true,
                v: res.payload.v,
                r: res.payload.r,
                s: res.payload.s
            };
        }
        return result;

    }

}

export {
    TrezorLogic
}
