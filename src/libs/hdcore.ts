import { Result, HDType } from './model/utils';
import { LedgerControler } from './ledger/index';
import { TrezorControler } from './trezor/index';
import { AddressParam } from './model/hd';
import { writeInfoLog,writeErrorLog } from './common/logger';

export class HdCore {
    private device_type: string;
    private ledger: LedgerControler;
    private trezor: TrezorControler;
    /**
     * 硬件sdk构造函数
     * @param device_type  硬件类型：ledger、trezor
     * @param coinType    币种类型：btc、ltc、bch、eth
     * @param networkType 节点环境：testnet、mainnet
     * @param derivationPath 路径：path
     */
    constructor(deviceType: string, coinType: string, networkType: string, derivationPath: string) {
        writeInfoLog(`初始化HDCore，硬件类型：${deviceType}，币种：${coinType}，network：${networkType}，path：${derivationPath}`);
        this.device_type = deviceType;
        this.ledger = new LedgerControler(coinType, derivationPath, networkType);
        this.trezor = new TrezorControler(coinType, derivationPath, networkType);
    }
    /**
     * 硬件签名暴露接口：支持硬件：leger,trezor，币种：eth,btc,ltc,bch
     * bch只支持主网
     * @param entity 后端返回 Json data 
     */
    public async signTransaction(entity: any): Promise<Result> {
        try {
            let signed: Result = {};
            switch (this.device_type) {
                case HDType.LEDGER:
                    signed = await this.ledger.signTransaction(entity);
                    break;
                case HDType.TREZOR:
                    signed = await this.trezor.signTransaction(entity);
                    break;
            }
            return signed;
        } catch (error) {
            writeErrorLog(error.message);
            return {
                success: false,
                message: error.message
            }
        }

    }
    /**
     * 硬件地址导出暴露接口：支持硬件：leger,trezor，币种：eth,btc,ltc,bch
     * bch只支持主网      
     * @param param 
     * isHd: boolean;true:硬件导入，false:xpub导入
     * segwit: boolean;
     * start: number;起始路径
     * end: number;结束路径
     * chainCode?: string;
     * publicKey?: string;
     * xPubStr?: string; 
     */
    public async getWalletAddress(param: AddressParam): Promise<Result> {
        try {
            let resp: Result = {};
            switch (this.device_type) {
                case HDType.LEDGER:
                    resp = await this.ledger.getCoinAddressList(param);
                    break;
                case HDType.TREZOR:
                    resp = await this.trezor.getCoinAddressList(param);
                    break;
            }
            return resp;
        } catch (error) {
            writeErrorLog(error.message);
            return {
                success: false,
                message: error.message
            }
        }
    }
}


