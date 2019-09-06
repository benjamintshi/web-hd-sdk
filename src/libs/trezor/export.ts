import { AddressParam } from "../model/hd";
import { Xpub } from './xpub';
import { AddressUtils } from '../common/address';
import { HDType } from "../model/utils";
class TrezorExport {
    private derivation_path: string;
    private coin_type: string;
    private xPub: Xpub;
    private addressUtils: AddressUtils;
    private network_type: string;
    constructor(derivationPath: string, coinType: string, networkType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.network_type = networkType;
        this.xPub = this.xPub = new Xpub(this.derivation_path, this.coin_type, this.network_type);
        this.addressUtils = new AddressUtils(HDType.TREZOR, derivationPath, coinType);
    }

    public async exportEthAddress(param: AddressParam): Promise<any> {
        let hdKey: any = await this.addressUtils.getEthHardwarHdKey(param, this.xPub, undefined);
        const addressList: Array<any> = this.addressUtils.getEthAddressList(param, hdKey);
        return {
            xpubStr: '',
            chainCode: param.isHd ? hdKey.chainCode : param.publicKey,
            publicKey: param.isHd ? hdKey.publicKey : param.chainCode,
            addressList: addressList,
        };
    }

    /**
     * 获取BTC系列的地址：btc,bch,ltc
     * @param param 
     */
    public async exportBtcSeriesAddress(param: AddressParam): Promise<any> {
        let xpubResp: any;
        if (param.isHd) {
            xpubResp = await this.xPub.getXpub();
        }
        const hdKey: any = await this.addressUtils.getBtcSeriesHardwarHdKey(param, xpubResp)
        const addressList: any = this.addressUtils.getBtcSeriesAddressList(param, hdKey);
        return {
            xpubStr: param.isHd ? xpubResp.xpubStr : param.xPubStr,
            chainCode: param.isHd ? xpubResp.chainCode : param.chainCode,
            publicKey: param.isHd ? xpubResp.publicKey : param.chainCode,
            addressList: addressList,
        };
    }
}

export {
    TrezorExport
}