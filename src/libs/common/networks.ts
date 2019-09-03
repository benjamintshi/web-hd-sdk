import { Networks as BtcNetworks, HDPublicKey as BtcHDPublicKey } from "bitcore-lib";
import { Networks as LiteNetworks, HDPublicKey as LiteHDPublicKey } from 'litecore-lib-st';
import { Networks as CashNetworks, HDPublicKey as CashHDPublicKey } from 'bitcore-lib-cash';
import { CoinType } from "../model/utils";

/**
 * 
 * @param coinType 币种类型
 * @param netEnv 币种环境：mainnet ,testnet
 */
function getNetworksFromLib(coinType: string, netEnv: string): any {
    switch (coinType) {
        case CoinType.BTC:
            return BtcNetworks[netEnv];
        case CoinType.BCH:
            return CashNetworks[netEnv];
        case CoinType.LTC:
            return LiteNetworks[netEnv];
        default:
            return BtcNetworks[netEnv];
    }
}
/**
 * 根据币种及xpub返回对应hdpub
 * @param coinType 币种类型
 * @param xpubStr  xpub
 */
function getHdPublicKeyFromLib(coinType: string, xpubStr: string): any {
    switch (coinType) {
        case CoinType.BTC:
            return new BtcHDPublicKey(xpubStr);
        case CoinType.BCH:
            return new CashHDPublicKey(xpubStr);
        case CoinType.LTC:
            return new LiteHDPublicKey(xpubStr);
        default:
            return new BtcHDPublicKey(xpubStr);
    }
}

/**
 * 根据币种及xpub返回对应hdpub
 * @param coinType 币种类型
 * @param xpubStr  xpub
 */
function getHdPublicKeyObjFromLib(coinType: string, opts: Object): any {
    switch (coinType) {
        case CoinType.BTC:
            return new BtcHDPublicKey(opts);
        case CoinType.BCH:
            return new CashHDPublicKey(opts);
        case CoinType.LTC:
            return new LiteHDPublicKey(opts);
        default:
            return new BtcHDPublicKey(opts);
    }
}

export {
    getNetworksFromLib,
    getHdPublicKeyFromLib,
    getHdPublicKeyObjFromLib
}


// const networks = {
//     0: {
//         apiName: "btc",
//         unit: "BTC",
//         name: "bitcoin",
//         satoshi: 8,
//         bitcoinjs: {
//             bech32: "bc",
//             bip32: {
//                 private: 76066276,
//                 public: 76067358
//             },
//             messagePrefix: "Bitcoin Signed Message:",
//             pubKeyHash: 0,
//             scriptHash: 5,
//             wif: 128
//         },
//         isSegwitSupported: true,
//         handleFeePerByte: true
//     },
//     1: {
//         apiName: "btc_testnet",
//         unit: "BTC",
//         name: "btc testnet",
//         satoshi: 8,
//         bitcoinjs: {
//             bech32: "bc",
//             bip32: {
//                 private: 70615956,
//                 public: 70617039
//             },
//             messagePrefix: "Bitcoin Signed Message:",
//             pubKeyHash: 111,
//             scriptHash: 196,
//             wif: 239
//         },
//         isSegwitSupported: true,
//         handleFeePerByte: true
//     },
//     2: {
//         name: "litecoin",
//         unit: "LTC",
//         apiName: "ltc",
//         isSegwitSupported: true,
//         satoshi: 8,
//         bitcoinjs: {
//             bech32: "bc",
//             bip32: {
//                 private: 0x019d9cfe,
//                 public: 0x019da462
//             },
//             messagePrefix: "Litecoin Signed Message:",
//             pubKeyHash: 48,//111-0x6f testnet, 48-0x30 mainnet
//             scriptHash: 50,
//             wif: 0xb0
//         },
//         handleFeePerByte: false
//     },
//     145: {
//         name: "bitcoin cash",
//         apiName: "abc",
//         satoshi: 8,
//         unit: "BCH",
//         bitcoinjs: {
//             bech32: "bc",
//             bip32: {
//                 private: 76066276,
//                 public: 76067358
//             },
//             messagePrefix: "Bitcoin Signed Message:",
//             pubKeyHash: 0,
//             scriptHash: 5,
//             wif: 128
//         },
//         sigHash: 0x41,
//         isSegwitSupported: true,
//         handleFeePerByte: true,
//         additionals: ["abc"]
//     },
//     128: {
//         apiName: "vtc",
//         unit: "VTC",
//         satoshi: 8,
//         name: "Vertcoin",
//         bitcoinjs: {
//             bip32: {
//                 public: 0x0488b21e,
//                 private: 0x05358394
//             },
//             messagePrefix: "Vertcoin Signed Message:",
//             pubKeyHash: 71,
//             scriptHash: 5,
//             wif: 128
//         },
//         isSegwitSupported: true,
//         handleFeePerByte: false
//     },
//     5: {
//         name: "dash",
//         satoshi: 8,
//         unit: "DASH",
//         apiName: "dash",
//         bitcoinjs: {
//             messagePrefix: "DarkCoin Signed Message:",
//             bip32: { public: 50221816, private: 87393172 },
//             pubKeyHash: 76,
//             scriptHash: 16,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: undefined
//     },
//     6: {
//         name: "peercoin",
//         satoshi: 6,
//         unit: "PPC",
//         apiName: "ppc",
//         bitcoinjs: {
//             messagePrefix: "PPCoin Signed Message:",
//             bip32: { public: 3874023909, private: 87393172 },
//             pubKeyHash: 55,
//             scriptHash: 117,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     14: {
//         name: "viacoin",
//         satoshi: 8,
//         unit: "VIA",
//         apiName: "via",
//         bitcoinjs: {
//             messagePrefix: "Viacoin Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 71,
//             scriptHash: 33,
//             wif: 128
//         },
//         isSegwitSupported: true,
//         handleFeePerByte: false,
//         areTransactionTimestamped: false
//     },
//     20: {
//         name: "digibyte",
//         satoshi: 8,
//         unit: "DGB",
//         apiName: "dgb",
//         bitcoinjs: {
//             messagePrefix: "DigiByte Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 30,
//             scriptHash: 5,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: false
//     },
//     47: {
//         name: "poswallet",
//         satoshi: 8,
//         unit: "POSW",
//         apiName: "posw",
//         bitcoinjs: {
//             messagePrefix: "PoSWallet Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 55,
//             scriptHash: 85,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     77: {
//         name: "pivx",
//         satoshi: 8,
//         unit: "PIV",
//         apiName: "pivx",
//         bitcoinjs: {
//             messagePrefix: "DarkNet Signed Message:",
//             bip32: { public: 36513075, private: 87393172 },
//             pubKeyHash: 30,
//             scriptHash: 13,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: false
//     },
//     79: {
//         name: "clubcoin",
//         satoshi: 8,
//         unit: "CLUB",
//         apiName: "club",
//         bitcoinjs: {
//             messagePrefix: "ClubCoin Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 28,
//             scriptHash: 85,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     88: {
//         name: "qtum",
//         satoshi: 8,
//         unit: "QTUM",
//         apiName: "qtum",
//         bitcoinjs: {
//             messagePrefix: "Qtum Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 58,
//             scriptHash: 50,
//             wif: 128
//         },
//         isSegwitSupported: true,
//         handleFeePerByte: false,
//         areTransactionTimestamped: undefined
//     },
//     105: {
//         name: "stratis",
//         satoshi: 8,
//         unit: "STRAT",
//         apiName: "strat",
//         bitcoinjs: {
//             messagePrefix: "Stratis Signed Message:",
//             bip32: { public: 76071454, private: 87393172 },
//             pubKeyHash: 63,
//             scriptHash: 125,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     125: {
//         name: "stealthcoin",
//         satoshi: 6,
//         unit: "XST",
//         apiName: "xst",
//         bitcoinjs: {
//             messagePrefix: "StealthCoin Signed Message:",
//             bip32: { public: 2405583718, private: 87393172 },
//             pubKeyHash: 62,
//             scriptHash: 85,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     133: {
//         name: "zcash",
//         satoshi: 8,
//         unit: "ZEC",
//         apiName: "zec",
//         bitcoinjs: {
//             messagePrefix: "Zcash Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 7352,
//             scriptHash: 7357,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: undefined,
//         expiryHeight: Buffer.from("00000000", 'hex')
//     },
//     141: {
//         name: "komodo",
//         satoshi: 8,
//         unit: "KMD",
//         apiName: "kmd",
//         bitcoinjs: {
//             messagePrefix: "Komodo Signed Message:",
//             bip32: { public: 4193182861, private: 87393172 },
//             pubKeyHash: 60,
//             scriptHash: 85,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: undefined
//     },
//     156: {
//         name: "bitcoin gold",
//         satoshi: 8,
//         unit: "BTG",
//         apiName: "btg",
//         bitcoinjs: {
//             messagePrefix: "Bitcoin gold Signed Message:",
//             bip32: { public: 76067358, private: 76066276 },
//             pubKeyHash: 38,
//             scriptHash: 23,
//             wif: 128
//         },
//         sigHash: 0x41,
//         isSegwitSupported: true,
//         handleFeePerByte: true,
//         areTransactionTimestamped: undefined,
//         additionals: ["gold"]
//     },
//     171: {
//         name: "hcash",
//         satoshi: 8,
//         unit: "HSR",
//         apiName: "hsr",
//         bitcoinjs: {
//             messagePrefix: "HShare Signed Message:",
//             bip32: { public: 76071454, private: 87393172 },
//             pubKeyHash: 40,
//             scriptHash: 100,
//             wif: 128
//         },
//         isSegwitSupported: false,
//         handleFeePerByte: false,
//         areTransactionTimestamped: true
//     },
//     121: {
//         name: "zencash",
//         satoshi: 8,
//         unit: "ZEN",
//         apiName: "zen",
//         bitcoinjs: {
//             messagePrefix: "Zencash Signed Message:",
//             bip32: { public: 76067358, private: 87393172 },
//             pubKeyHash: 0x2089,
//             scriptHash: 0x2096,
//             wif: 128
//         },
//     },
//     3: {
//         name: "dogecoin",
//         satoshi: 8,
//         unit: "Ð",
//         apiName: "doge",
//         bitcoinjs: {
//             messagePrefix: "Dogecoin Signed Message:",
//             bip32: { public: 0x02facafd, private: 87393172 },
//             pubKeyHash: 30,
//             scriptHash: 22,
//             wif: 128
//         },
//     }
// };