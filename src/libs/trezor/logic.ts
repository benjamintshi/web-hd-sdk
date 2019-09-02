
import {CoinType} from "../model/utils";
import {SEND_ENUM,trezorBtcEntityResult,PAY_ENUM,dealWithInputsResult} from "./common/utils";
import bitcore from 'bitcore-lib';
import {BtcUtil} from "./common/BtcUtil";
import bitcoinjslib from 'bitcoinjs-lib';
import util from 'util';
import { toHex, numberToHex } from 'web3-utils';
import { convert } from 'ethereumjs-units';
import {EthData, EthEntity} from "../model/eth";
import ethUtil from "ethereumjs-util";
import trezor from "trezor-connect";
import {Utxos} from "../model/btc";
class TrezorLogic {


    private coin_type: string;
    private  BtcUtils : BtcUtil;
    constructor(coinType: string) {
        this.coin_type = coinType;
        this.BtcUtils = new BtcUtil();

    }
    public async getBtcTrezorEntity(data:any):Promise<trezorBtcEntityResult>{
        return {
           inputs : await this.getTrezorInputs(data),
           outputs : await this.getTrezorOutputs(data.outputs),
            multisig : true
        }

    }
    private getEthTrezorEntity(){

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
    public async getTrezorInputs (data:any):Promise<any> {
        let inputs:Array<any> = [], input:any = {};
        let coinName:string = this.coin_type.toLocaleLowerCase();
        let dataInput:any = data.input;
        if (dataInput.paths.length > 1){
            if(coinName === CoinType.BCH || coinName === CoinType.LTC){
                let dealRes = this.dealWithInputs(dataInput.paths, dataInput.signIndex, dataInput.redeemScript);

                dataInput.paths = dealRes.newPaths;
                dataInput.signIndex = dealRes.newSignIndex
            }
         }

        data.utxos.forEach(utxo => {
            input = {
                address_n: this.BtcUtils.getHDPath(dataInput.paths[dataInput.signIndex].path),
                prev_index: utxo.index,
                prev_hash: utxo.txid
            }
            input.script_type = dataInput.paths[dataInput.signIndex].addressType;
            input.amount = bitcore.Unit.fromBTC(utxo.coinNum).toSatoshis();

            inputs.push(input);
        });
        //多签地址
        if (dataInput.paths.length > 1) {
            let pubkeys:any = [];
            dataInput.paths.forEach(path => {
                let address_n = this.BtcUtils.getHDPath(path.path);
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
        // else {
        //   //单签地址，p2pkh 移除amount属性
        //   if (inputs.length == 1 && paths[signIndex].addressType === process.env.SEND_ENUM.p2pkh) {
        //     delete inputs[0].amount;
        //   }
        // }
        return inputs;
        }
    /**
     * 获取 trezor 需要的 outputs 结构
     * @param outputs
     * @returns {Promise<Array>}
     */
    private async getTrezorOutputs (outputs) {
        let tmpArray:Array<any> = [];
        outputs.forEach(output => {
        if (!output.address && output.coinNum === 0){
            tmpArray.push({
                op_return_data: output.hex.substr(4),
                amount: '0',
                script_type: PAY_ENUM.op_return_type
            });
        } else{
            tmpArray.push({
                address: output.address,
                amount: bitcore.Unit.fromBTC(output.coinNum).toSatoshis(),
                script_type: output.isScript ? PAY_ENUM.p2sh :PAY_ENUM.p2pkh
            });
        }
        });
            return tmpArray;
    }
    // 处理BCH、LTC中paths顺序以及signIndex字段
   private dealWithInputs (paths, signIndex, redeemScript):dealWithInputsResult {
        // decode redeemScript, 取其中的publicKey
        let redeemBuf = bitcoinjslib.script.decompile(Buffer.from(redeemScript, 'hex'));
        let p:Array<any> = new Array();
        redeemBuf.forEach(item => {
            if(util.isBuffer(item)) {
                 p.push(item.toString('hex'));
            }
        });

        // 对paths进行重新排序, 并拿到新的signIndex值
        let newPaths:Array<any> = new Array();
        let newSignIndex:any = null;
        p.forEach((item, index) => {
            if (paths[signIndex].addressPublicKey === item){
                newSignIndex = index;
            }
            paths.forEach(path => {
                if(path.addressPublicKey === item){
                    newPaths.push(path)
                }
            })
        });
        return {
            newPaths: newPaths,
            newSignIndex: newSignIndex
        }
     }
    /**
     * 获取签名需要返回的数据  - ETH
     * @param data      服务返回签名所需要的数据
     * @returns transaction  返回交易对象
     */
   public async getTransactionDataForEth (data:EthData):Promise< EthEntity > {

        let signEthereumData:EthEntity = {
            // path: data.input.path,
            nonce: numberToHex(data.nonce),
            gasPrice: numberToHex(data.gasPrice),
            gasLimit: numberToHex(data.gasLimit),
            to: toHex(data.toAddress),
            value: numberToHex(convert(data.txnCoinNum, 'eth', 'wei')),
            data: data.data == null ? '' : toHex(data.data),
            chainId: numberToHex(data.chainId)
        }
        return signEthereumData;
    }
    /**
     * 硬件签名 - ETH
     * @param ts
     * @param callback
     * @returns {Promise<void>}
     */
    public async trezorSignTxForEth (ts,path, callback) {
        let signData = {
            path: path,
            transaction :ts
        };
        //生成完整报文所需数据
        let rawTx = ts;
        let EIP155Supported = true;
        let eTx = new ethUtil.Tx(rawTx);
        eTx.raw[6] = Buffer.from([rawTx.chainId]);
        eTx.raw[7] = eTx.raw[8] = 0;
        let toHash = !EIP155Supported ? eTx.raw.slice(0, 6) : eTx.raw;
        // let txToSign = ethUtil.rlp.encode(toHash);
        trezor.ethereumSignTransaction(signData).then(function(result) {
            if (result.success) {
                rawTx.v = result.payload.v;
                rawTx.r = result.payload.r;
                rawTx.s = result.payload.s;
                eTx = new ethUtil.Tx(rawTx);
                rawTx.rawTx = JSON.stringify(rawTx);
                rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
                rawTx.isError = false;
                callback({
                    success: result.success,
                    v: result.payload.v,
                    r: result.payload.r,
                    s: result.payload.s
                });
            }
            else {
                callback(result)
            }
        });

    }


}
export {
    TrezorLogic
}
