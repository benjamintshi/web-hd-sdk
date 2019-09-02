import trezor from "trezor-connect";
// import BitCoreLib from "bitcore-lib";
import {Signature, SignatureResult, Result} from "../model/utils";
import {TrezorLogic} from "./logic";
import {EthEntity} from "../model/eth";
import {trezorBtcEntityResult} from "./common/utils";
const BitCoreLib = require("bitcore-lib")
class TrezorTransaction {
    private logic : TrezorLogic
    constructor(coinType:string){
        this.logic  = new TrezorLogic(coinType);
    }
    public async BtcSign  (data):Promise<SignatureResult>{
        let transData:any = this.logic.getBtcTrezorEntity(data);
        const  self = this;
       let res = await this.signTransaction( transData, function (resp) {
            let result:SignatureResult = {};
            result.success = false;
            if (resp.success) {
                result = self.getSignature(resp.payload.serializedTx, transData.multisig, resp.payload.signatures);
                result.success = true;
            }else{
                result = resp;
            }

            return result;
        });
       return res;

    }
    public async signTransaction(data,callback):Promise <any>{
        const result = await trezor.signTransaction({
            inputs: data.inputs,
            outputs: data.outputs,
            coin: data.coinName
        });
        callback(result)
    }

    /**
     包装硬件返回结果 BTC 系列
     @message      硬件返回信息
     @isMutliSign    是否为多签交易
     @signResult    签名后的交易报文（trezor）
     **/
   public  getSignature(message:string, isMutliSign:boolean, signResult:Array<any>):SignatureResult {

        let bitcoreTransaction:any = new BitCoreLib.Transaction();
        bitcoreTransaction.fromString(message);
        let signatures:Array<any> = [];
        let index = isMutliSign == true ? 1 : 0;				//多签交易第0位为签名的顺序标记
        bitcoreTransaction.inputs.forEach(function (vin, i) {
        let sign;
        if (signResult == undefined) {
            sign = vin.script.chunks[index].buf.toString("hex");
            sign = sign.substring(0, sign.length - 2);
        }
        else {
            sign = signResult[i];
        }
            signatures.push({
                txid: vin.prevTxId.toString('hex'),
                signature: sign
            });
        });
        let result:SignatureResult = {
            signeds: signatures,
            version: bitcoreTransaction.version
        };
        return result;
   }

   /**
   * Eth签名
   * */
   public async EthSign(data:any){

       let transData = this.logic.getTransactionDataForEth(data);
      let res =  await this.logic.trezorSignTxForEth(transData,data.input.path, function (resp) {
          return resp;
       });
   }
}
export {
    TrezorTransaction
}
