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
    BCH = 'bch'
}
enum HDType {
    LEDGER = 'ledger',
    TREZOR = 'trezor'
}

interface  SignatureResult extends EthResult, BtcResult {
    signeds?:Array<Signature>,
    version?:number,
    success?:boolean
}
export {
    Result,
    CoinType,
    HDType,
    Signature,
    SignatureResult
}
