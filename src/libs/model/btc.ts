interface BtcSeriesEntity {
    inputs: Array<any>;
    paths: Array<string>;
    outputScript: string;
    isMutiSign: boolean;
    segwit: boolean;
    /**
     * @param additionals list of additionnal options
     *
     * - "bech32" for spending native segwit outputs
     * - "abc" for bch
     * - "gold" for btg
     * - "bipxxx" for using BIPxxx
     * - "sapling" to indicate a zec transaction is supporting sapling (to be set over block 419200)
     */
    additionals?: string;
    /**
     * sigHashType is the hash type of the transaction to sign, or default (all)
     */
    sigHashType?: string;
}
interface BtcSeriesData {
    input: Input;
    outputs: Array<OutPut>;
    utxos: Array<Utxo>;
}
interface Input {
    address: string;
    paths: Array<Path>;
    requires: number;
    signIndex: number;
    redeemScript?: string;
}
interface Path {
    addressPublicKey: string;
    addressType: string;
    path: string;
    xpub: string;
}
interface OutPuts {
    outputs: Array<OutPut>;
}
interface OutPut {
    address: string;
    coinNum: number;
    isScript: boolean;
    outputType: number;
    sequence: number;
}
interface Utxos {
    utxos: Array<Utxo>;
}
interface Utxo {
    index: number;
    txid: string;
    sequence: number;
    coinNum: number;
}

enum SEND_ENUM {
    /* 输出类型 */
    p2pkh = "SPENDADDRESS",
    multi = "SPENDMULTISIG",
    segwitP2wpkh = "SPENDWITNESS",
    multiP2wsh = "SPENDWITNESS",
    segwitP2sh = "SPENDP2SHWITNESS"

}
/* 支付类型 */
enum PAY_ENUM {
    p2pkh = "PAYTOADDRESS",
    p2sh = "PAYTOP2SHWITNESS",
    op_return_type = "PAYTOOPRETURN"
}

/**
 * Ledger splitTransaction Api 接口
 */
enum TX_SPLIT_API {
    BTC = "https://api.ledgerwallet.com/blockchain/v2/btc_testnet/transactions",
    BCH = "https://api.ledgerwallet.com/blockchain/v2/abc/transactions",
    LTC = "https://chain.so/api/v2/get_tx/LTC"
}

export {
    BtcSeriesEntity,
    Utxos,
    Utxo,
    OutPuts,
    OutPut,
    BtcSeriesData,
    SEND_ENUM,
    PAY_ENUM,
    TX_SPLIT_API
}
