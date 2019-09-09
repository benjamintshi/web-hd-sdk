import { AddressParam } from "../model/hd";
import { getHdPublicKeyFromLib } from '../common/networks';
import { HDType, CoinType } from "../model/utils";
import { writeInfoLog } from "./logger";
const ethereumWallet = require('ethereumjs-wallet');
const HDKey = require("hdkey");

class AddressUtils {
    private device_type: string;
    private derivation_path: string;
    private coin_type: string;
    /**
     * 地址推导工具类：业务代码逻辑复用
     * @param deviceType 
     * @param derivationPath 
     * @param coinType 
     */
    constructor(deviceType: string, derivationPath: string, coinType: string) {
        this.device_type = deviceType;
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        writeInfoLog(`初始化地址推导工具类.`);
    }
    /**
     * 获取eth 地址推导对象
     * @param param 
     * @param xPub 
     * @param transport 
     */
    public async getEthHardwarHdKey(param: AddressParam, xPub?: any, transport?: any): Promise<any> {
        try {
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
        } catch (error) {
            throw new Error(`获取eth地址推导对象HDKey失败，错误信息：${error.message}`);
        }
    }

    /**
     * 推导地址
     * @param param 
     * @param hdKey 
     */
    public getEthAddressList(param: AddressParam, hdKey: any): Array<any> {
        try {
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
        } catch (error) {
            throw new Error(`eth地址列表推导失败错误信息：${error.message}`);
        }
    }

    /**
     * 获取btc系列 地址推导对象
     * @param param 
     * @param xpubResp 
     */
    public async getBtcSeriesHardwarHdKey(param: AddressParam, xpubResp?: any): Promise<any> {
        try {
            let xpubStr: string;
            if (param.isHd) {
                xpubStr = xpubResp.xpubStr;
            } else {
                xpubStr = param.xPubStr ? param.xPubStr : "";
            }
            let hdKey: any = getHdPublicKeyFromLib(this.coin_type, xpubStr);
            return hdKey;
        } catch (error) {
            throw new Error(`获取btc系列地址推导对象HDKey失败，错误信息：${error.message}`);
        }
    }

    /**
     * 推导地址
     * @param param 
     * @param hdKey 
     */
    public async  getBtcSeriesAddressList(param: AddressParam, hdKey: any): Promise<Array<any>> {
        try {
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
        } catch (error) {
            throw new Error(`btc系列地址列表推导失败错误信息：${error.message}`);
        }
    }
}
export {
    AddressUtils
}