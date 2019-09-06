import { AddressParam } from "../model/hd";
import { getHdPublicKeyFromLib } from '../common/networks';
import { HDType, CoinType } from "../model/utils";
const ethereumWallet = require('ethereumjs-wallet');
const HDKey = require("hdkey");

class AddressUtils {
    private device_type: string;
    private derivation_path: string;
    private coin_type: string;
    constructor(deviceType: string, derivationPath: string, coinType: string) {
        this.device_type = deviceType;
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
    }
    public async getEthHardwarHdKey(param: AddressParam, xPub?: any, transport?: any): Promise<any> {
        const hdKey: any = new HDKey();
        if (param.isHd) {
            let resp: any;
            switch (this.device_type) {
                case HDType.LEDGER:
                    resp = await transport.getAddress(this.derivation_path, false, true);
                    break;
                case HDType.TREZOR:
                    resp = await xPub.getXpub();
                    break;
                default:
                    break;
            }
            hdKey.publicKey = Buffer.from(resp.publicKey, 'hex');
            hdKey.chainCode = Buffer.from(resp.chainCode, 'hex');
        } else {
            hdKey.publicKey = Buffer.from(param.publicKey ? param.publicKey : '', 'hex');
            hdKey.chainCode = Buffer.from(param.chainCode ? param.chainCode : '', 'hex');
        }
        return hdKey;

    }
    public getEthAddressList(param: AddressParam, hdKey: any): Array<any> {
        const addressList: Array<any> = new Array<any>();
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = hdKey.deriveChild(0).deriveChild(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: '0x' + ethereumWallet.fromPublicKey(deriveObj.publicKey, true).getAddress().toString('hex'),
                coinType: CoinType.ETH,
                pubKeyObj: {
                    hex: '0x' + deriveObj.publicKey.toString('hex'),
                    baseEncoding: ''
                },
            });
        }
        return addressList;
    }

    public async getBtcSeriesHardwarHdKey(param: AddressParam, xpubResp?: any): Promise<any> {
        let xpubStr: string;
        if (param.isHd) {
            xpubStr = xpubResp.xpubStr;
        } else {
            xpubStr = param.xPubStr ? param.xPubStr : "";
        }
        let hdKey: any = getHdPublicKeyFromLib(this.coin_type, xpubStr);
        return hdKey;
    }

    public async  getBtcSeriesAddressList(param: AddressParam, hdKey: any): Promise<Array<any>> {
        const addressList: Array<any> = new Array<any>();
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = hdKey.derive(0).derive(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: deriveObj.publicKey.toAddress().toString('hex'),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: deriveObj.publicKey.toString('hex'),
                    baseEncoding: ''
                },
            });
        }
        return addressList
    }

}
export {
    AddressUtils
}