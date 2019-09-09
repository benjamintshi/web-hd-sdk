import { WalletHd, WalletPublicKey } from '../model/hd';
import { crypto } from 'bitcore-lib';
import * as BipPath from "bip32-path";
import { getCompressPublicKey } from '../common/utils';
import { LedgerTransport } from './transport';
import { getNetworksFromLib, getHdPublicKeyObjFromLib } from '../common/networks';
import { writeInfoLog } from '../common/logger';
class Xpub {
    private derivation_path: string;// = "44'/0'/0'";
    private coin_type: string;
    private coin_num: number;
    private network_type: string;
    /**
     * xpub推导函数类
     * @param derivationPath 
     * @param coinType 
     * @param netWorkType 
     */
    constructor(derivationPath: string, coinType: string, netWorkType: string) {
        this.derivation_path = derivationPath;
        this.coin_type = coinType;
        this.network_type = netWorkType;
        this.coin_num = (BipPath.fromString(this.derivation_path).toPathArray()[2] & ~0x80000000);
        writeInfoLog(`初始化xpub推导函数类.`);
    }

    /**
     * 获取硬件xpub
     * @param segwit 是否支持隔离见证-暂未使用到
     */
    public async getXpub(segwit: boolean): Promise<any> {
        writeInfoLog(`获取硬件xpub.`);
        let hd: WalletHd = await this.getWalletPublicKey();
        let xpubStr: string = await this.buildXpub(hd);
        return {
            chainCode: hd.chainCode,
            publicKey: hd.publicKey,
            xpubStr: xpubStr
        };
    }

    /**
     * 链接硬件获取账户级：publickey,chaincode级币种级公钥
     */
    private async getWalletPublicKey(): Promise<WalletHd> {
        try {
            writeInfoLog(`获取硬件账户级:publickey,chaincode.`);
            let device = await new LedgerTransport(this.coin_type).getTransport();
            //获取账户级public key
            let parentPath: string = BipPath.fromPathArray(BipPath.fromString(this.derivation_path).toPathArray().slice(0, -1)).toString();
            let accountPublicKey: WalletPublicKey = await device.getWalletPublicKey(this.derivation_path);
            let coinPublicKey: WalletPublicKey = await device.getWalletPublicKey(parentPath);
            let resp: WalletHd = {
                chainCode: accountPublicKey.chainCode,
                publicKey: getCompressPublicKey(accountPublicKey.publicKey),
                parentPublicKey: getCompressPublicKey(coinPublicKey.publicKey)
            };
            return resp;
        } catch (error) {
            throw new Error(`获取硬件账户级：publickey失败，错误信息：${error.message}`);
        }
    }

    /**
     * 根据账户级：publickey,chaincode级币种级公钥推导账户级xpub
     * @param hd 
     */
    private async buildXpub(hd: WalletHd): Promise<string> {
        try {
            writeInfoLog(`根据账户级：publickey,chaincode级币种级公钥推导账户级xpub.`);
            let network: any = getNetworksFromLib(this.coin_type, this.network_type);
            let parentPublicKey: string = hd.parentPublicKey;
            let sha256PublicKey: Buffer = crypto.Hash.sha256(Buffer.from(parentPublicKey, 'hex'));
            let r160PublicKey: Buffer = crypto.Hash.ripemd160(sha256PublicKey);
            let parentFingerPrint: number = r160PublicKey.readInt32BE(0, true) >>> 0;
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
        } catch (error) {
            throw new Error(`构造硬件xpub失败，错误信息：${error.message}`);
        }
    }
}

export {
    Xpub
}