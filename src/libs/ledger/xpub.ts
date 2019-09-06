import { WalletHd, WalletPublicKey } from '../model/hd';
import { crypto } from 'bitcore-lib';
import * as BipPath from "bip32-path";
import { Utils } from '../common/utils';
import { LedgerTransport } from './transport';
import { getNetworksFromLib, getHdPublicKeyObjFromLib } from '../common/networks';
class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    private coin_num: number;
    private network_type: string;
    constructor(derivationPath: string, coinType: string, netWorkType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        this.network_type = netWorkType;
        this.coin_num = (BipPath.fromString(this.derivation_path).toPathArray()[2] & ~0x80000000);
    }

    public async getXpub(segwit: boolean): Promise<any> {
        let hd: WalletHd = await this.getWalletPublicKey();
        let xpubStr: string = await this.buildXpub(hd);
        return {
            chainCode: hd.chainCode,
            publicKey: hd.publicKey,
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
        let sha256PublicKey: Buffer = crypto.Hash.sha256(Buffer.from(parentPublicKey,'hex'));
        let r160PublicKey:Buffer = crypto.Hash.ripemd160(sha256PublicKey);
        let parentFingerPrint:number = r160PublicKey.readInt32BE(0,true) >>> 0;
        //((r160PublicKey[0] << 24) | (r160PublicKey[1] << 16) | (r160PublicKey[2] << 8) | r160PublicKey[3]) >>> 0;
        let childIndex: number = (0x80000000 | this.coin_num) >>> 0; //0 为账户0
        let derived: any = getHdPublicKeyObjFromLib(this.coin_type, {
            network: network,
            depth: 3,
            parentFingerPrint: parentFingerPrint,
            childIndex: childIndex,
            chainCode: hd.chainCode,
            publicKey: hd.publicKey
        });
        return derived.toString();
    }
}

export {
    Xpub
}