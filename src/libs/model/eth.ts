interface EthEntity {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string;
    chainId: chainIdType;
    path?:string
}
interface EthData {
    chainId: number;
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    input: EthInput;
    toAddress: string;
    txnCoinNum: number;
    data:string;

}
type chainIdType = string | number;
interface EthInput {
    address: string;
    path: string;
}
interface trezorBtcEntityResult {
    multisig:boolean,
    outputs:any,
    inputs:any
}

interface  dealWithInputsResult{
    newPaths: any,
    newSignIndex: any
}
interface SignatureResult{

}
export {
    EthEntity,
    EthData,
    trezorBtcEntityResult,
    dealWithInputsResult
}
