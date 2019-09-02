interface BtcSeriesEntity {
    inputs: Array<any>;
    paths: Array<string>;
    outputScript: string;
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
    additionals?:string;
    /**
     * sigHashType is the hash type of the transaction to sign, or default (all)
     */
    sigHashType?:string;
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

interface signTransactionRes{

}
export {
    BtcSeriesEntity,
    Utxos,
    Utxo,
    OutPuts,
    OutPut,
    BtcSeriesData
}
