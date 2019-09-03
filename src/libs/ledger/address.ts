import { LedgerTransport } from "./transport";
import { Xpub } from './xpub';
import { AddressParam } from "../model/hd";
import * as BipPath from "bip32-path";
import { CoinType } from "../model/utils";
import { getHdPublicKeyFromLib } from '../common/networks';
const HDKey = require("hdkey");
const ethereumWallet = require('ethereumjs-wallet');
class LedgerAddress {
    private xPub: Xpub;
    private derivation_path: string;
    private coin_type: string;
    private coin_num: string;
    constructor(derivationPath: string, coinType: string, networkType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.xPub = new Xpub(derivationPath, coinType, networkType);
        this.coin_num = (BipPath.fromString(this.derivation_path).toPathArray()[1] & ~0x80000000).toString();
    }

    public async getEthAddress(param: AddressParam): Promise<any> {
        const dhPub: any = new HDKey();
        let resp: any;
        if (param.isHd) {
            let device: any = await new LedgerTransport(this.coin_type).getTransport();
            resp = await device.getAddress(this.derivation_path, false, true);
            dhPub.publicKey = Buffer.from(resp.publicKey, 'hex');
            dhPub.chainCode = Buffer.from(resp.chainCode, 'hex');
        } else {
            dhPub.publicKey = Buffer.from(param.publicKey ? param.publicKey : '', 'hex');
            dhPub.chainCode = Buffer.from(param.chainCode ? param.chainCode : '', 'hex');
        }
        const addressList: Array<any> = new Array<any>();
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = dhPub.deriveChild(0).deriveChild(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: '0x' + ethereumWallet.fromPublicKey(deriveObj.publicKey, true).getAddress().toString('hex'),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: '0x' + deriveObj.publicKey.toString('hex'),
                    baseEncoding: ''
                },
            });
        }
        return {
            xpubStr: '',
            chainCode: resp ? resp.chainCode : '',
            publicKey: resp ? resp.publicKey : '',
            addressList: addressList,
        };
    }

    /**
     * 获取BTC系列的地址：btc,bch,ltc
     * @param param 
     */
    public async getBtcSeriesAddress(param: AddressParam): Promise<any> {
        const resp: any = await this.getHdPublicKey(param);
        const hdPubKey: any = resp.hdPubKey;
        const addressList: Array<any> = this.getAddressList(param, hdPubKey);
        return {
            xpubStr: resp.xpubStr,
            chainCode: resp ? resp.chainCode : '',
            publicKey: resp ? resp.publicKey : '',
            addressList: addressList,
        };
    }

    private async getHdPublicKey(param: AddressParam): Promise<any> {
        let xpubStr: string;
        let resp: any;
        if (param.isHd) {
            resp = await this.xPub.getXpub(param.segwit);
            xpubStr = resp.xpubStr;
        } else {
            xpubStr = param.xPubStr ? param.xPubStr : "";
        }
        let hdPubKey: any = getHdPublicKeyFromLib(this.coin_type, xpubStr);
        return {
            hdPubKey: hdPubKey,
            xpubStr: xpubStr,
            chainCode: resp ? resp.chainCode : '',
            publicKey: resp ? resp.publicKey : '',
        };
    }
    private getAddressList(param: AddressParam, hdPubKey: any): Array<any> {
        const addressList: Array<any> = new Array<any>();
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = hdPubKey.derive(0).derive(i);
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
    LedgerAddress
}