import { WalletHd, WalletPublicKey } from '../model/hd';
import { crypto } from 'bitcore-lib';
import * as BipPath from "bip32-path";
import { Utils } from '../common/utils';
import { LedgerTransport } from './transport';
import { getNetworksFromLib, getHdPublicKeyObjFromLib } from '../common/networks';
class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    private coin_num: string;
    private network_type: string;
    constructor(derivationPath: string, coinType: string, netWorkType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        this.network_type = netWorkType;
        this.coin_num = (BipPath.fromString(this.derivation_path).toPathArray()[1] & ~0x80000000).toString();
    }

    public async getXpub(segwit: boolean): Promise<any> {
        let hd: WalletHd = await this.getWalletPublicKey();
        let xpubStr: string = await this.buildXpub(hd);
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
        let parentPath: string = BipPath.fromPathArray(BipPath.fromString(this.derivation_path).toPathArray().slice(0, -1)).toString();
        let accountPublicKey: WalletPublicKey = await device.getWalletPublicKey(this.derivation_path);
        let coinPublicKey: WalletPublicKey = await device.getWalletPublicKey(parentPath);
        let resp: WalletHd = {
            chainCode: accountPublicKey.chainCode,
            publicKey: Utils.getCompressPublicKey(accountPublicKey.publicKey),
            parentPublicKey: Utils.getCompressPublicKey(coinPublicKey.publicKey)
        };
        return resp;
    }

    private async buildXpub(hd: WalletHd): Promise<string> {
        let network: any = getNetworksFromLib(this.coin_type, this.network_type);
        let parentPublicKey: string = hd.parentPublicKey;
        let hexPubKey: Array<any> = Utils.parseHexString(parentPublicKey);
        let bufPublicKey: Buffer = crypto.Hash.sha256(Buffer.from(hexPubKey));
        bufPublicKey = crypto.Hash.ripemd160(bufPublicKey);
        let fingerPrint = ((bufPublicKey[0] << 24) | (bufPublicKey[1] << 16) | (bufPublicKey[2] << 8) | bufPublicKey[3]) >>> 0;
        let childNum: number = (0x80000000 | 0) >>> 0; //0 为账户0
        let derived: any = getHdPublicKeyObjFromLib(this.coin_type, {
            network: network,
            depth: 3,
            parentFingerPrint: fingerPrint,
            childIndex: childNum,
            chainCode: hd.chainCode,
            publicKey: hd.publicKey
        });
        return derived.toString();
    }
}

export {
    Xpub
}