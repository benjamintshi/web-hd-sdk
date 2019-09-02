
import { bchaddrjs } from 'bchaddrjs';
import { CoinType, HDType } from '../model/utils';
const bitcoinjs = require('bitcoinjs-lib');
class AddressTools {
    public static getCoinAddress(address: string, coinType: string): string {
        switch (coinType) {
            case CoinType.BTC:
                return address;
            case CoinType.BCH:
                return this.getBchConvertAddress(address);
            case CoinType.LTC:
                return this.getLtcConvertAddress(address);
            default:
                return address;
        }
    }
    private static getBchConvertAddress(address: string, deviceType?: string): string {
        if (bchaddrjs.isP2PKHAddress(address) || bchaddrjs.isP2SHAddress(address)) {
            return deviceType === HDType.LEDGER ? bchaddrjs.toLegacyAddress(address) : bchaddrjs.toCashAddress(address);
        } else {
            return address;
        }
    }
    private static getLtcConvertAddress(address: string, deviceType?: string): string {
        let decoded: string = bitcoinjs.address.fromBase58Check(address);
        let version: number = decoded['version'];
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
export {
    AddressTools
}