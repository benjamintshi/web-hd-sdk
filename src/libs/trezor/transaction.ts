import trezor from "trezor-connect";
import {SignatureResult, CoinType, Result, Signature} from "../model/utils";
import {TrezorLogic} from "./logic";
import {TransactionModel} from "../common/transaction";
import {Tools} from "../common/tools";

const BitCoreLib = require("bitcore-lib");

class TrezorTransaction {
    private logic: TrezorLogic;
    private tranactionModel: TransactionModel;
    private networkType: string;
    private device_name: string;
    private cointype:string;
    constructor(coinType: string, networkType: string, device_name: string) {
        this.logic = new TrezorLogic(coinType);
        this.tranactionModel = new TransactionModel(true);
        this.networkType = networkType;
        this.device_name = device_name;
        this.cointype = coinType;
    }

    public async BtcSign(data): Promise<SignatureResult> {
        let transData: any = await this.logic.getBtcTrezorEntity(data);
        const self = this;
        let result: SignatureResult = {
            success: false
        };
        await this.signTransaction(transData, function (resp) {
            if (resp.success) {
                result.signeds = self.tranactionModel.getSignature(resp.payload.serializedTx, transData.multisig);
                result.version = self.tranactionModel.getVersion(resp.payload.serializedTx);
                result.success = true;
            } else {
                result = resp;
            }

        });
        return result;


    }

    public async signTransaction(data, callback): Promise<any> {
        const result = await trezor.signTransaction({
            inputs: data.inputs,
            outputs: data.outputs,
            coin: this.cointype
        });
        callback(result)
    }


    /**
     * Eth签名
     * */
    public async EthSign(data: any): Promise<Result> {
        let transData = this.logic.getTransactionDataForEth(data);
        return await this.logic.trezorSignTxForEth(transData, data.input.path);

    }

    /**
     * Ltc签名 bch签名
     */
    public async BtcSeriesSign(data: any, coin_type: string): Promise<SignatureResult> {
        data.input.address = Tools.getCoinAddress(data.input.address, coin_type, this.device_name);
        data.outputs.forEach(item => {
            item.address = Tools.getCoinAddress(item.address, coin_type, this.device_name);
        });
        if (data.input.paths.length > 1) {
            data.input = this.logic.dealWithInputs(data.input);
        }
        return this.BtcSign(data);
    }

}

export {
    TrezorTransaction
}
