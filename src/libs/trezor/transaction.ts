import { SignatureResult, Result } from "../model/utils";
import { TrezorLogic } from "./logic";
import { Tools } from "../common/tools";
import { getSignature, getMutiSignSignature } from "../common/signature";
import { trezor } from './transport';

class TrezorTransaction {
    private logic: TrezorLogic;
    private device_name: string;
    private coin_type: string;
    private network_type: string;
    private version: number = 1;
    constructor(coinType: string, networkType: string, device_name: string) {
        this.logic = new TrezorLogic(coinType);
        this.network_type = networkType;
        this.device_name = device_name;
        this.coin_type = coinType;
    }

    /**
     * Eth签名
     * @param data 
     */
    public async EthSign(data: any): Promise<Result> {
        let transData = this.logic.getTransactionDataForEth(data);
        let signData = {
            path: data.input.path,
            transaction: transData
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

    /**
     * btc sign
     * @param data 
     */
    public async BtcSign(data: any): Promise<SignatureResult> {
        let transData: any = await this.logic.getBtcTrezorEntity(data);
        let result: SignatureResult = {
            success: false
        };
        const resp: any = await trezor.signTransaction({
            inputs: data.inputs,
            outputs: data.outputs,
            coin: this.coin_type
        });
        if (resp.success) {
            result.signeds = transData.multisig ? getMutiSignSignature(resp.payload.serializedTx, data.utxos) : getSignature(resp.payload.serializedTx, true);
            result.version = this.version;//getVersion(resp.payload.serializedTx);
            result.success = true;
        }
        return result;
    }

    /**
     * Ltc签名 bch签名
     * @param data 
     * @param coin_type 
     */
    public async BtcSeriesSign(data: any): Promise<SignatureResult> {
        data.input.address = Tools.getCoinAddress(data.input.address, this.coin_type, this.device_name);
        data.outputs.forEach(item => {
            item.address = Tools.getCoinAddress(item.address, this.coin_type, this.device_name);
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
