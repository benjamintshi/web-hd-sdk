import { WalletHd, WalletPublicKey } from '../model/hd';
import { crypto } from 'bitcore-lib';
import { encode } from 'bs58'
import { BIPPath } from "bip32-path";
import { networks } from '../common/networks';
import { Utils } from '../common/utils';
import _ from 'lodash';

class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    constructor(derivationPath: string, coinType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
    }
    public async getXpub(segwit: boolean, transport: any): Promise<any> {
        let hd: WalletHd = await this.getWalletPublicKey(segwit, transport);
        return {
            chainCode: hd.chainCode,
            publicKey: hd.publicKey,
            xpubStr: this.initialize(hd)
        };
    }
    private async getWalletPublicKey(segwit: boolean, transport: any): Promise<WalletHd> {
        let device = await transport.getTransport();
        //获取账户级public key
        let ledgerPub: WalletPublicKey = await device.getWalletPublicKey(this.derivation_path);
        let parentPubKey: string = await this.getParentWalletPublickey(segwit, transport);
        let resp: WalletHd = {
            chainCode: ledgerPub.chainCode,
            publicKey: ledgerPub.publicKey,
            parentPublicKey: parentPubKey
        };
        return resp;
    }

    private async getParentWalletPublickey(segwit: boolean, transport: any): Promise<string> {
        let device = await transport.getTransport();
        let parentPath: string = BIPPath.fromPathArray(BIPPath.fromString(this.derivation_path).toPathArray().slice(0, -1)).toString();
        return await device.getWalletPublicKey(parentPath, segwit, segwit).publicKey;
    }

    private initialize(hd: WalletHd): string {
        const network: any = this.getNetworkBySymbol().bitcoinjs;
        let parentPublicKey: string = this.compressPublicKey(hd.parentPublicKey);
        let hexPubKey: Array<any> = Utils.parseHexString(parentPublicKey);
        let bufPublicKey: Buffer = crypto.Hash.sha256(Buffer.from(hexPubKey));
        bufPublicKey = crypto.Hash.ripemd160(bufPublicKey);
        const path: Array<any> = this.derivation_path.split('/');
        const depth: number = path.length;
        const lastChild: any = path[path.length - 1].split('\'');
        let fingerPrint: number = ((bufPublicKey[0] << 24) | (bufPublicKey[1] << 16) | (bufPublicKey[2] << 8) | bufPublicKey[3]) >>> 0;
        let childNum: number = (lastChild.length === 1) ? parseInt(lastChild[0]) : (0x80000000 | parseInt(lastChild[0])) >>> 0;
        let publicKey: string = this.compressPublicKey(hd.publicKey);
        let xpubStr: string = this.createXpub(
            depth,
            fingerPrint,
            childNum,
            hd.chainCode,
            publicKey,
            network.bip32.public
        );
        return this.encodeBase58Check(xpubStr);
    }
    private createXpub(depth: number, fingerPrint: number, childNum: number, chainCode: string, publicKey: string, netWork: any): string {
        let xpub: string = Utils.toHexInt(netWork);
        xpub = xpub + _.padStart(depth.toString(16), 2, "0");
        xpub = xpub + _.padStart(fingerPrint.toString(16), 8, "0");
        xpub = xpub + _.padStart(childNum.toString(16), 8, "0");
        xpub = xpub + chainCode;
        xpub = xpub + publicKey;
        return xpub;
    }
    private encodeBase58Check(xpubStr: string): string {
        let strVal: Array<any> = Utils.parseHexString(xpubStr);
        let chkSum: Buffer = crypto.Hash.sha256(Buffer.from(strVal));
        chkSum = crypto.Hash.sha256(chkSum);
        chkSum = chkSum.slice(0, 4);
        let hash: Array<any> = strVal.concat(Array.from(chkSum));
        return encode(hash);
    }

    private compressPublicKey(publicKey: string): string {
        let compressedKeyIndex: string;
        if (publicKey.substring(0, 2) !== "04") {
            return publicKey;
        }
        if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
            compressedKeyIndex = "03";
        } else {
            compressedKeyIndex = "02";
        }
        return compressedKeyIndex + publicKey.substring(2, 66);
    }

    private getNetworkBySymbol(): any {
        const networkId: any = Object.keys(networks).find((id: string): any => networks[id].unit === this.coin_type.toUpperCase())
        return networks[networkId];
    }
}
export {
    Xpub
}