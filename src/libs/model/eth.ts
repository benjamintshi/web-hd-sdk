interface EthEntity {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string;
    chainId: string;
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
interface EthInput {
    address: string;
    path: string;
}

export {
    EthEntity,
    EthData
}