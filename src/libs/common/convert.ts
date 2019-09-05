import { isP2PKHAddress, toLegacyAddress, isP2SHAddress, toCashAddress } from 'bchaddrjs';
import { CoinType, HDType } from '../model/utils';
const bitcoinjs = require('bitcoinjs-lib');


/**
 * 格式化地址
 * @param address    地址
 * @param coinType   币种
 * @param deviceType 硬件类型
 */
function getCoinAddress(address: string, coinType: string, deviceType?: string): string {
    switch (coinType) {
        case CoinType.BTC:
            return address;
        case CoinType.BCH:
            return getBchConvertAddress(address, deviceType);
        case CoinType.LTC:
            return getLtcConvertAddress(address, deviceType);
        default:
            return address;
    }
}

function getBchConvertAddress(address: string, deviceType?: string): string {
    try {
        if (isP2PKHAddress(address) || isP2SHAddress(address)) {
            return deviceType === HDType.LEDGER ? toLegacyAddress(address) : toCashAddress(address);
        } else {
            return address;
        }
    } catch (error) {
        throw Error(`bch:${address} address is invalid.`);
    }
}
function getLtcConvertAddress(address: string, deviceType?: string): string {
    try {
        let decoded: string = bitcoinjs.address.fromBase58Check(address);
        let version: number = decoded['version'];
        if (deviceType === HDType.TREZOR) {
            switch (version) {
                case 5:
                    return bitcoinjs.address.toBase58Check(decoded['hash'], 50);
                case 196:
                    return bitcoinjs.address.toBase58Check(decoded['hash'], 58);
                default:
                    return address;
            }
        } else {
            switch (version) {
                case 50:
                    return bitcoinjs.address.toBase58Check(decoded['hash'], 5)
                case 58:
                    return bitcoinjs.address.toBase58Check(decoded['hash'], 196)
                case 5:
                case 196:
                    return address;
                default:
                    return address;
            }
        }
    } catch (error) {
        throw Error(`ltc:${address} address is invalid.`);
    }
}

export {
    getCoinAddress
}
