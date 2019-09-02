interface BtcEntity {
    inputs: Array<any>;
    paths: Array<string>;
    outputScript: string;
    segwit: boolean;
}
interface BtcData {
    input: BtcInput;
    outputs: Array<OutPut>;
    utxos: Array<Utxo>;
}
interface BtcInput {
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
    BtcEntity,
    Utxos,
    Utxo,
    OutPuts,
    OutPut,
    BtcData
}
