import { SignatureResult, Result } from "../model/utils";
import { getSignature, getMutiSignSignature } from "../common/signature";
import { TrezorConnect } from './transport';
import { Utxos } from "../model/btc";
import { writeInfoLog } from "../common/logger";

class TrezorTransaction {
    private coin_type: string;
    private version: number = 1;
    constructor(coinType: string) {
        this.coin_type = coinType;
        writeInfoLog(`初始化交易签名函数类.`);
    }

    /**
     * Eth签名
     * @param entity 
     */
    public async EthSign(entity: any): Promise<Result> {
        try {
            writeInfoLog(`Eth交易签名.`);
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
        } catch (error) {
            throw new Error(`Eth硬件签名失败，错误信息：${error.message}`);
        }
    }

    /**
     * btc sign
     * @param data 
     */
    public async BtcSeriesSign(entity: any, utxos: Utxos): Promise<SignatureResult> {
        try {
            writeInfoLog(`Btc系列交易签名.`);
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
        } catch (error) {
            throw new Error(`${this.coin_type}硬件签名失败，错误信息：${error.message}`);
        }
    }
}

export {
    TrezorTransaction
}
