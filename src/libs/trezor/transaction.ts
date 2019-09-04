import { SignatureResult, Result } from "../model/utils";
import { TrezorLogic } from "./logic";
import { Tools } from "../common/tools";
import { getSignature, getMutiSignSignature } from "../common/signature";
import { TrezorConnect } from './transport';
import { Utxos } from "../model/btc";

class TrezorTransaction {
    private logic: TrezorLogic;
    private device_name: string;
    private coin_type: string;
    private version: number = 1;
    constructor(coinType: string, device_name: string) {
        this.logic = new TrezorLogic(coinType);
        this.device_name = device_name;
        this.coin_type = coinType;
    }

    /**
     * Eth签名
     * @param entity 
     */
    public async EthSign(entity: any): Promise<Result> {
        let result: Result = {
            success: false
        };
        let resp: any = await TrezorConnect.ethereumSignTransaction(entity);
        if (resp.success) {
            result = {
                success: true,
                v: resp.payload.v,
                r: resp.payload.r,
                s: resp.payload.s
            };
        } else {
            result.message = resp.payload.error;
        }
        return result;
    }

    /**
     * btc sign
     * @param data 
     */
    public async BtcSeriesSign(entity: any, utxos: Utxos): Promise<SignatureResult> {
        let result: SignatureResult = {
            success: false
        };
        const resp: any = await TrezorConnect.signTransaction({
            inputs: entity.inputs,
            outputs: entity.outputs,
            coin: this.coin_type
        });
        if (resp.success) {
            result.signeds = entity.multisig ? getMutiSignSignature(resp.payload.signatures, utxos) : getSignature(resp.payload.serializedTx, true);
            result.version = this.version;//getVersion(resp.payload.serializedTx);
            result.success = true;
        } else {
            result.message = resp.payload.error;
        }
        return result;
    }
}

export {
    TrezorTransaction
}
