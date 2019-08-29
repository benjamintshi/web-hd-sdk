import { LedgerTransport } from "./transport";
import { Xpub } from './xpub';
import { AddressParam } from "../model/hd";
import { HDPublicKey } from "bitcore-lib";
import { HDKey } from 'hdkey';
class LedgerAddress {
    private xPub: Xpub;
    private transport?: any;
    private derivation_path: string;
    private coin_type: string;
    constructor(derivationPath: string, coinType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.xPub = new Xpub(derivationPath, coinType);
    }
    public async getEthAddress(param: AddressParam): Promise<any> {
        let resp: any;
        const dhPub: HDKey = new HDKey();
        if (param.isHd) {
            this.transport = await new LedgerTransport(this.coin_type).getTransport();
            resp = await this.transport.getAddress(this.derivation_path, false, true);
            dhPub.publicKey = new Buffer(resp.publicKey, 'hex');
            dhPub.chainCode = new Buffer(resp.chainCode, 'hex');
        } else {
            dhPub.publicKey = new Buffer(param.publicKey ? param.publicKey : '', 'hex');
            dhPub.chainCode = new Buffer(param.chainCode ? param.chainCode : '', 'hex');
        }
        const addressList: Array<any> = new Array<any>();
        for (let i: number = 0; i < param.start; i++) {
            let deriveObj: any = dhPub.deriveChild(0).deriveChild(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: deriveObj.publicKey.toAddress().toString(),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: deriveObj.publicKey.toString('hex'),
                    baseEncoding: ''
                },
            });
        }
    }
    public async getBtcAddress(param: AddressParam): Promise<any> {
        let xpubStr: string;
        let resp: any;
        if (param.isHd) {
            this.transport = await new LedgerTransport(this.coin_type).getTransport();
            resp = await this.xPub.getXpub(param.segwit, this.transport);
            xpubStr = resp.xpubStr;
        } else {
            xpubStr = param.xPubStr ? param.xPubStr : "";
        }
        const dhPub:HDPublicKey = new HDPublicKey(xpubStr);
        const addressList: Array<any> = new Array<any>();
        for (let i: number = 0; i < param.start; i++) {
            let deriveObj: any = dhPub.derive(0).derive(i);
            addressList.push({
                path: this.derivation_path + '/' + i,
                address: deriveObj.publicKey.toAddress().toString(),
                coinType: this.coin_type,
                pubKeyObj: {
                    hex: deriveObj.publicKey.toString('hex'),
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