import {WalletHd, WalletPublicKey, XPubEntity} from '../model/hd';
import {crypto} from 'bitcore-lib';
import {encode} from 'bs58'
import * as BIPPath from "bip32-path";
import {networks} from '../common/networks';
import {Utils} from '../common/utils';
import {LedgerTransport} from './transport';
import {padStart} from 'lodash';

class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    private coin_num: string;

    constructor(derivationPath: string, coinType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        this.coin_num = (BIPPath.fromString(this.derivation_path).toPathArray()[1] & ~0x80000000).toString();
    }

    public async getXpub(segwit: boolean): Promise<any> {
        let hd: WalletHd = await this.getWalletPublicKey();
        let xpubStr: string = await this.initialize(hd);
        return {
            chainCode: hd.chainCode,
            publicKey: hd.publicKey,
            parentPublicKey: hd.parentPublicKey,
            xpubStr: xpubStr
        };
    }

    private async getWalletPublicKey(): Promise<WalletHd> {
        let device = await new LedgerTransport(this.coin_type).getTransport();
        //获取账户级public key
        let parentPath: string = BIPPath.fromPathArray(BIPPath.fromString(this.derivation_path).toPathArray().slice(0, -1)).toString();
        let accountPublicKey: WalletPublicKey = await device.getWalletPublicKey(this.derivation_path);
        let coinPublicKey: WalletPublicKey = await device.getWalletPublicKey(parentPath);
        let resp: WalletHd = {
            chainCode: accountPublicKey.chainCode,
            publicKey: Utils.getCompressPublicKey(accountPublicKey.publicKey),
            parentPublicKey: Utils.getCompressPublicKey(coinPublicKey.publicKey)
        };
        return resp;
    }


    private async initialize(hd: WalletHd): Promise<string> {
        const network: any = this.getNetworkBySymbol().bitcoinjs;
        let parentPublicKey: string = hd.parentPublicKey;
        let hexPubKey: Array<any> = Utils.parseHexString(parentPublicKey);
        let bufPublicKey: Buffer = crypto.Hash.sha256(Buffer.from(hexPubKey));
        bufPublicKey = crypto.Hash.ripemd160(bufPublicKey);
        let fingerPrint = ((bufPublicKey[0] << 24) | (bufPublicKey[1] << 16) | (bufPublicKey[2] << 8) | bufPublicKey[3]) >>> 0;
        let childNum: number = (0x80000000 | 0) >>> 0;
        let xpubStr: string = this.createXpub(
            {
                depth: 3,
                fingerPrint: fingerPrint,
                childNum: childNum,
                chainCode: hd.chainCode,
                publicKey: hd.publicKey,
                network: network.bip32.public //0x043587cf
            }
        );
        return this.encodeBase58Check(xpubStr);
    }

    private createXpub(entity: XPubEntity): string {
        return [
            Utils.toHexInt(entity.network),
            padStart(entity.depth.toString(16), 2, '0'),
            padStart(entity.fingerPrint.toString(16), 8, '0'),
            padStart(entity.childNum.toString(16), 8, '0'),
            entity.chainCode,
            entity.publicKey,
        ].join('');
    }

    private encodeBase58Check(xpubStr: string): string {
        let strVal: Array<any> = Utils.parseHexString(xpubStr);
        let chkSum: Buffer = crypto.Hash.sha256(Buffer.from(strVal));
        chkSum = crypto.Hash.sha256(chkSum);
        chkSum = chkSum.slice(0, 4);
        let hash: Array<any> = strVal.concat(Array.from(chkSum));
        return encode(Buffer.from(hash));
    }

    private getNetworkBySymbol(): any {
        //const networkId: any = Object.keys(networks).find((id: string): any => networks[id].unit === this.coin_type.toUpperCase())
        const networkId: any = Object.keys(networks).find((id: string): any => id === this.coin_num)
        return networks[networkId];
    }
}

export {
    Xpub
}