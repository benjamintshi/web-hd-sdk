interface EthResult {
    v?: string;
    r?: string;
    s?: string;
}
interface BtcResult {
    signatures?: Array<Signature>;
    version?: number;
}
interface Signature {
    txid?: string;
    sign?: string;
}
interface Result extends EthResult, BtcResult {
    success?: boolean;
    message?: string;
}
enum CoinType {
    BTC = 'btc',
    ETH = 'eth',
    LTC = 'ltc',
    BCH = 'bch',
    /**
     * trezor btc testnet = testnet
     */
    TESTNET = 'testnet',
    BITCOIN = 'bitcoin'
}
enum HDType {
    LEDGER = 'ledger',
    TREZOR = 'trezor'
}
enum NetWorkType {
    mainnet = 'mainnet',
    testnet = 'testnet'
}

interface SignatureResult extends EthResult, BtcResult {
    signeds?: Array<Signature>;
    success?: boolean;
    message?: string;
}
export {
    Result,
    CoinType,
    HDType,
    Signature,
    SignatureResult,
    NetWorkType
}
