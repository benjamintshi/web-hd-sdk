import {TrezorLogic} from "./logic";
import {TrezorTransaction} from "./transaction"
import {CoinType, Result} from "../common/utils"
class TrezorControl {
    private logic : TrezorLogic
    private transaction:TrezorTransaction;
    private coin_type:string;
    constructor(coinType:string) {
        this.logic  = new TrezorLogic(coinType);
        this.transaction = new TrezorTransaction(coinType);
        this.coin_type = coinType;

    }
    public async signTransaction(data: any): Promise<any> {
        switch (this.coin_type) {
            case CoinType.ETH:
                 return await this.transaction.EthSign(data);
            case CoinType.BTC:
                return await this.transaction.BtcSign(data);
        }
    }

}

export {
    TrezorControl
}
