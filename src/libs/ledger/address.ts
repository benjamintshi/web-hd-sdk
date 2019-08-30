import {LedgerTransport} from "./transport";
import {Xpub} from './xpub';
import {AddressParam} from "../model/hd";
import {HDPublicKey} from "bitcore-lib";

const HDKey = require("hdkey");

class LedgerAddress {
    private xPub: Xpub;
    private derivation_path: string;
    private coin_type: string;

    constructor(derivationPath: string, coinType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.xPub = new Xpub(derivationPath, coinType);
    }

    public async getEthAddress(param: AddressParam): Promise<any> {
        const dhPub: any = new HDKey();
        let resp: any;
        if (param.isHd) {
            let device: any = await new LedgerTransport(this.coin_type).getTransport();
            resp = await device.getAddress(this.derivation_path, false, true);
            dhPub.publicKey = new Buffer(resp.publicKey, 'hex');
            dhPub.chainCode = new Buffer(resp.chainCode, 'hex');
        } else {
            dhPub.publicKey = new Buffer(param.publicKey ? param.publicKey : '', 'hex');
            dhPub.chainCode = new Buffer(param.chainCode ? param.chainCode : '', 'hex');
        }
        const addressList: Array<any> = new Array<any>();
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = dhPub.deriveChild(0).deriveChild(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: deriveObj.publicKey.toString('hex'),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: deriveObj.publicKey.toString('hex'),
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

    public async getBtcAddress(param: AddressParam): Promise<any> {
        let xpubStr: string;
        let resp: any;
        if (param.isHd) {
            resp = await this.xPub.getXpub(param.segwit);
            xpubStr = resp.xpubStr;
        } else {
            xpubStr = param.xPubStr ? param.xPubStr : "";
        }
        const addressList: Array<any> = new Array<any>();
        const dhPub: HDPublicKey = new HDPublicKey(xpubStr);
        for (let i: number = param.start; i < param.end; i++) {
            let deriveObj: any = dhPub.derive(0).derive(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: deriveObj.publicKey.toAddress().toString('hex'),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: deriveObj.publicKey.toAddress().toString('hex'),
                    baseEncoding: ''
                },
            });
        }
        return {
            xpubStr: xpubStr,
            chainCode: resp ? resp.chainCode : '',
            publicKey: resp ? resp.publicKey : '',
            addressList: addressList,
        };
    }
}

export {
    LedgerAddress
}