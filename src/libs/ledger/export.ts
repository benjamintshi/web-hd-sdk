import { LedgerTransport } from "./transport";
import { Xpub } from './xpub';
import { AddressParam } from "../model/hd";
import { AddressUtils } from '../common/address';
import { HDType } from "../model/utils";

class LedgerExport {
    private xPub?: Xpub;
    private derivation_path: string;
    private coin_type: string;
    private network_type: string;
    private addressUtils: AddressUtils;
    constructor(derivationPath: string, coinType: string, networkType: string) {
        this.coin_type = coinType;
        this.derivation_path = derivationPath;
        this.network_type = networkType;
        this.addressUtils = new AddressUtils(HDType.LEDGER, derivationPath, coinType);
    }

    public async exportEthAddress(param: AddressParam): Promise<any> {
        let transport: any;
        if (param.isHd) {
            transport = await new LedgerTransport(this.coin_type).getTransport();
        }
        let hdKey: any = await this.addressUtils.getEthHardwarHdKey(param, undefined, transport);
        const addressList: Array<any> = this.addressUtils.getEthAddressList(param, hdKey);
        return {
            xpubStr: '',
            chainCode: param.isHd ? hdKey.chainCode : param.publicKey,
            publicKey: param.isHd ? hdKey.publicKey : param.chainCode,
            addressList: addressList,
        };
    }

    /**
     * 导出BTC系列的地址：btc,bch,ltc
     * @param param 
     */
    public async exportBtcSeriesAddress(param: AddressParam): Promise<any> {
        let xpubResp: any;
        if (param.isHd) {
            this.xPub = new Xpub(this.derivation_path, this.coin_type, this.network_type);
            xpubResp = await this.xPub.getXpub(param.segwit);
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
    LedgerExport
}