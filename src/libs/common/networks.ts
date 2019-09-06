import { Networks as BtcNetworks, HDPublicKey as BtcHDPublicKey } from "bitcore-lib";
import { Networks as LiteNetworks, HDPublicKey as LiteHDPublicKey } from 'litecore-lib-st';
import { Networks as CashNetworks, HDPublicKey as CashHDPublicKey } from 'bitcore-lib-cash';
import { CoinType } from "../model/utils";

/**
 * 根据币种返回对应networks
 * @param coinType 币种类型
 * @param netEnv 币种环境：mainnet ,testnet
 */
function getNetworksFromLib(coinType: string, networkType: string): any {
    switch (coinType) {
        case CoinType.BTC:
            return BtcNetworks[networkType];
        case CoinType.BCH:
            return CashNetworks[networkType];
        case CoinType.LTC:
            return LiteNetworks[networkType];
        default:
            return BtcNetworks[networkType];
    }
}
/**
 * 根据币种及xpub返回对应hdpub
 * @param coinType 币种类型
 * @param xpubStr  xpub
 */
function getHdPublicKeyFromLib(coinType: string, xpubStr: string): any {
    return getCoinHDPublicKey(coinType, xpubStr, undefined);
}

/**
 * 根据币种及xpub返回对应hdpub
 * @param coinType 币种类型
 * @param xpubStr  xpub
 */
function getHdPublicKeyObjFromLib(coinType: string, opts: Object): any {
    return getCoinHDPublicKey(coinType, undefined, opts);
}
/**
 * 返回lib对象
 * @param coinType 
 * @param xpubStr 
 * @param opts 
 */
function getCoinHDPublicKey(coinType: string, xpubStr?: string, opts?: Object) {
    let tmpParam: any = xpubStr ? xpubStr : opts;
    switch (coinType) {
        case CoinType.BTC:
            return new BtcHDPublicKey(tmpParam);
        case CoinType.BCH:
            return new CashHDPublicKey(tmpParam);
        case CoinType.LTC:
            return new LiteHDPublicKey(tmpParam);
        default:
            return new BtcHDPublicKey(tmpParam);
    }
}

export {
    getNetworksFromLib,
    getHdPublicKeyFromLib,
    getHdPublicKeyObjFromLib
}