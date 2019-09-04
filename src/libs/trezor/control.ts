import { TrezorLogic } from "./logic";
import { TrezorTransaction } from "./transaction"
import { CoinType } from "../model/utils"

class TrezorControler {
    private transaction: TrezorTransaction;
    private coin_type: string;
    private logic?: TrezorLogic;
    constructor(coinType: string, networkType: string, device_name: string) {
        this.transaction = new TrezorTransaction(coinType, device_name);
        this.coin_type = coinType;
    }

    public async signTransaction(data: any): Promise<any> {
        this.logic = new TrezorLogic(this.coin_type);
        const entity: any = await this.logic.getTrezorEntity(data);
        switch (this.coin_type) {
            case CoinType.ETH:
                return await this.transaction.EthSign(entity);
            case CoinType.BTC:
            case CoinType.TESTNET:
            case CoinType.BCH:
            case CoinType.LTC:
                return await this.transaction.BtcSeriesSign(entity, data.utxos);
            default:
                return await this.transaction.BtcSeriesSign(entity, data.utxos);
        }
    }
}

export {
    TrezorControler
}
