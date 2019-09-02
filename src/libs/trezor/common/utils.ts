enum SEND_ENUM  {
    /* 输出类型 */

    p2pkh= "SPENDADDRESS",
    multi= "SPENDMULTISIG",
    segwitP2wpkh= "SPENDWITNESS",
    multiP2wsh= "SPENDWITNESS",
    segwitP2sh= "SPENDP2SHWITNESS"

}
interface trezorBtcEntityResult {
    multisig:boolean,
    outputs:any,
    inputs:any
}
/* 支付类型 */
enum PAY_ENUM {
    p2pkh = "PAYTOADDRESS",
    p2sh = "PAYTOP2SHWITNESS",
    op_return_type = "PAYTOOPRETURN"
}
interface  dealWithInputsResult{
    newPaths: any,
    newSignIndex: any
}
export {
    SEND_ENUM,
    trezorBtcEntityResult,
    PAY_ENUM,
    dealWithInputsResult
}
