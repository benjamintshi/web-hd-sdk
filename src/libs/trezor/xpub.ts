import { getCompressPublicKey } from '../common/utils';
import { TrezorConnect } from './transport';
import * as BipPath from "bip32-path";
import { NetWorkType, CoinType } from '../model/utils';
import { writeInfoLog } from '../common/logger';
class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    private network_type: string;
    constructor(derivationPath: string, coinType: string, networkType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        this.network_type = networkType;
        writeInfoLog(`初始化xpub推导函数类.`);
    }

    public async getXpub(): Promise<any> {
        try {
            writeInfoLog(`获取硬件xpub.`);
            const resp: any = await TrezorConnect.getPublicKey({
                path: BipPath.fromString(this.derivation_path).toString(),
                coin: (this.network_type === NetWorkType.testnet && (this.coin_type === CoinType.BTC || this.coin_type === CoinType.LTC)) ? 'testnet' : this.coin_type
            })
            return {
                chainCode: resp.payload.chainCode,
                publicKey: getCompressPublicKey(resp.payload.publicKey),
                xpubStr: resp.payload.xpub
            }
        } catch (error) {
            throw new Error(`获取硬件xpub失败，错误信息：${error.message}`);
        }
    }
}

export {
    Xpub
}