interface WalletHd extends WalletPublicKey {
    parentPublicKey: string;
    xpub?: string;
}

interface WalletPublicKey {
    publicKey: string;
    bitcoinAddress?: string;
    chainCode: string;
}

interface AddressParam{
    /**
     * 是否硬件
     */
    isHd:boolean;
    segwit:boolean;
    start:number;
    end:number;
    chainCode?:string;
    publicKey?:string;
    xPubStr?:string;
}


export {
    WalletHd,
    WalletPublicKey,
    AddressParam
}