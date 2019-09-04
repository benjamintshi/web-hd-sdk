import {isP2PKHAddress, toLegacyAddress, isP2SHAddress, toCashAddress} from 'bchaddrjs';
import {CoinType, HDType} from '../model/utils';

const bitcoinjs = require('bitcoinjs-lib');

class Tools {
    public static getCoinAddress(address: string, coinType: string, deviceType?: string): string {
        switch (coinType) {
            case CoinType.BTC:
                return address;
            case CoinType.BCH:
                return this.getBchConvertAddress(address, deviceType);
            case CoinType.LTC:
                return this.getLtcConvertAddress(address, deviceType);
            default:
                return address;
        }
    }

    private static getBchConvertAddress(address: string, deviceType?: string): string {
        if (isP2PKHAddress(address) || isP2SHAddress(address)) {
            return deviceType === HDType.LEDGER ? toLegacyAddress(address) : toCashAddress(address);
        } else {
            return address;
        }
    }

    private static getLtcConvertAddress(address: string, deviceType?: string): string {
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

    }
}

export {
    Tools
}
