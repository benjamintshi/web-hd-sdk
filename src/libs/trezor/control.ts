import {TrezorLogic} from "./logic";
import {TrezorTransaction} from "./transaction"
import {CoinType, Result} from "../model/utils"

class TrezorControler {
    private logic: TrezorLogic
    private transaction: TrezorTransaction;
    private coin_type: string;
    constructor(coinType: string,networkType:string,device_name:string ) {
        this.logic = new TrezorLogic(coinType);
        this.transaction = new TrezorTransaction(coinType,networkType,device_name);
        this.coin_type = coinType;
    }

    public async signTransaction(data: any): Promise<any> {
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.EthSign(data);
            case CoinType.BTC:
                return await this.transaction.BtcSign(data);
            case CoinType.BCH:
                return await this.transaction.BchSign(data);
            case CoinType.LTC:
                return await this.transaction.LtcSign(data);
        }
    }

}

export {
    TrezorControler
}
