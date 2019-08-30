interface WalletHd extends WalletPublicKey {
    parentPublicKey: string;
    xpub?: string;
}

interface WalletPublicKey {
    publicKey: string;
    bitcoinAddress?: string;
    chainCode: string;
}

interface AddressParam {
    /**
     * 是否硬件
     */
    isHd: boolean;
    /**
     * 是否隔离见证
     */
    segwit: boolean;
    /**
     * 开始路径
     */
    start: number;
    /**
     * 结束路径
     */
    end: number;
    chainCode?: string;
    publicKey?: string;
    xPubStr?: string;
}

interface XPubEntity {
    depth: number;
    fingerPrint: number;
    childNum: number;
    chainCode: string;
    publicKey: string;
    network: number;
}

export {
    WalletHd,
    WalletPublicKey,
    AddressParam,
    XPubEntity
}